import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Appointment.css";

const serviceDurations = {
  Haircut: 30,
  Facial: 60,
  Cleanup: 30,
  Threading: 20,
  Waxing: 30,
  Pedicure: 30,
  Manicure: 30,
  "Hair Massage": 60,
};

const salonOpenTime = 12 * 60; // 12:00 PM
const salonCloseTime = 19 * 60 + 30; // 7:30 PM ✅ updated

const blockedDates = ["2025-07-10", "2025-07-20"];

const isTuesday = (dateStr) => new Date(dateStr).getDay() === 2;

const minutesToTimeString = (minutes) => {
  let hrs = Math.floor(minutes / 60);
  let mins = minutes % 60;
  let ampm = hrs >= 12 ? "PM" : "AM";
  hrs = hrs % 12;
  if (hrs === 0) hrs = 12;
  return `${hrs}:${mins.toString().padStart(2, "0")} ${ampm}`;
};

const formatDateDMY = (isoDateStr) => {
  const [year, month, day] = isoDateStr.split("-");
  return `${day}/${month}/${year}`;
};

const Appointment = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    service: "",
    timeSlot: "",
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);

  const generateSlots = (duration) => {
    const slots = [];
    for (let time = salonOpenTime; time + duration <= salonCloseTime; time += duration) {
      slots.push(minutesToTimeString(time));
    }
    return slots;
  };

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!formData.date || !formData.service) return;

      setLoadingSlots(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/appointments?date=${formData.date}`);
        const bookedForDate = res.data.bookedSlots || [];
        const duration = serviceDurations[formData.service];
        const slots = generateSlots(duration);
        const filteredSlots = slots.filter((slot) => !bookedForDate.includes(slot));
        setAvailableSlots(filteredSlots);
        setFormData((prev) => ({ ...prev, timeSlot: "" }));
      } catch (err) {
        console.error("Failed to fetch booked slots", err);
        setAvailableSlots([]);
      }
      setLoadingSlots(false);
    };

    fetchBookedSlots();
  }, [formData.date, formData.service]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      if (isTuesday(value)) {
        alert("Sorry, we are closed on Tuesdays. Please select another day.");
        resetForm();
        return;
      }

      if (blockedDates.includes(value)) {
        alert("Sorry, the parlour is closed on this date. Please select another day.");
        resetForm();
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      date: "",
      service: "",
      timeSlot: "",
    });
    setAvailableSlots([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.timeSlot) {
      alert("Please select a time slot.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/appointments", formData);
      alert(res.data.message);
      setBookingId(res.data.bookingId);
      setSubmitted(true);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to book appointment";
      alert(message);
    }
  };

  if (submitted) {
    return (
      <div className="appointment-page">
        <h2>Thank you!</h2>
        <p>
          Your appointment for {formData.service} has been booked on{" "}
          {formatDateDMY(formData.date)} at {formData.timeSlot}.
        </p>
        <p>
          Your booking ID is <strong>{bookingId}</strong><br />
          You will receive your confirmation on your registered email id.
        </p>
      </div>
    );
  }

  return (
    <div className="appointment-page">
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSubmit} className="appointment-form">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          pattern="[0-9]{10}"
          title="Enter 10-digit phone number"
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          min={new Date().toISOString().split("T")[0]}
        />
        <select
          name="service"
          value={formData.service}
          onChange={handleChange}
          required
          disabled={!formData.date}
        >
          <option value="">Select Service</option>
          {Object.keys(serviceDurations).map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>

        {loadingSlots && <p>Loading available slots...</p>}

        {availableSlots.length > 0 && !loadingSlots && (
          <select
            name="timeSlot"
            value={formData.timeSlot}
            onChange={handleChange}
            required
          >
            <option value="">Select Time Slot</option>
            {availableSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        )}

        {availableSlots.length === 0 && formData.service && !loadingSlots && (
          <p>No available slots for this service on selected date.</p>
        )}

        <button type="submit" disabled={availableSlots.length === 0 || loadingSlots}>
          Book Now
        </button>
      </form>
    </div>
  );
};

export default Appointment;
