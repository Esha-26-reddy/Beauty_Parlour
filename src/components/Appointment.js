import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Appointment.css";

const Appointment = () => {

  const serviceDurations = {
    "Haircut": 30,
    "Facial": 60,
    "Waxing": 30,
    "Threading": 15,
    "Manicure": 40,
    "Pedicure": 40,
    "Bridal Makeup": 0
  };

  const OPEN_TIME = 12 * 60;        // 12:00 PM
  const CLOSE_TIME = 19 * 60 + 30;  // 7:30 PM

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    service: "",
    timeSlot: ""
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Convert minutes to 12-hour format
  const minutesToTime = (mins) => {
    let hours = Math.floor(mins / 60);
    let minutes = mins % 60;
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  // Generate time slots (memoized to prevent ESLint warning)
  const generateSlots = useCallback((service) => {
    if (service === "Bridal Makeup") {
      return ["12:00 PM", "3:30 PM"];
    }

    const duration = serviceDurations[service];
    const slots = [];

    for (let time = OPEN_TIME; time + duration <= CLOSE_TIME; time += duration) {
      slots.push(minutesToTime(time));
    }

    return slots;
  }, []);

  // Update slots when service changes
  useEffect(() => {
    if (formData.service) {
      setAvailableSlots(generateSlots(formData.service));
    } else {
      setAvailableSlots([]);
    }
  }, [formData.service, generateSlots]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      const selectedDate = new Date(value);
      if (selectedDate.getDay() === 2) {
        setMessage("❌ We are closed on Tuesdays. Please select another day.");
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post(
        "http://localhost:5000/api/appointments",
        formData
      );

      setMessage(
        "✅ Your appointment has been booked successfully! A confirmation email has been sent to your registered email address."
      );

      setFormData({
        name: "",
        phone: "",
        email: "",
        date: "",
        service: "",
        timeSlot: ""
      });

      setAvailableSlots([]);

    } catch (error) {
      setMessage(
        error.response?.data?.message || "❌ Something went wrong"
      );
    }

    setLoading(false);
  };

  return (
    <div className="appointment-page">
      <h2>Book Appointment</h2>

      {message && (
        <p className={message.includes("❌") ? "error-message" : "success-message"}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="appointment-form">

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
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
        >
          <option value="">Select Service</option>
          {Object.keys(serviceDurations).map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>

        {availableSlots.length > 0 && (
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

        <button type="submit" disabled={loading}>
          {loading ? "Booking..." : "Book Appointment"}
        </button>

      </form>
    </div>
  );
};

export default Appointment;
