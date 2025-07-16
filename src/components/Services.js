import React from 'react';
import { useParams } from 'react-router-dom';
import './Services.css';

const servicesData = {
  "skincare-treatments": {
    title: "Skincare Treatments",
    items: [
      {
        name: "Pimple Treatment",
        description: "Clears acne, soothes inflammation, and promotes healthy, blemish-free skin.",
        image: "/images/service1.jpeg"
      },
      {
        name: "Complexion-Improvement Treatment",
        description: "Enhances skin tone, boosts radiance, and evens out pigmentation for a glowing complexion.",
        image: "/images/service2.jpeg"
      },
      {
        name: "Pigmentation Treatment",
        description: "Reduces dark spots and discoloration, revealing a clearer and more even skin tone.",
        image: "/images/service3.jpeg"
      }
    ]
  },

  "hair-cuts": {
    title: "Hair Cuts",
    items: [
      {
        name: "Straight Cut",
        description: "A classic haircut with evenly trimmed ends for a sleek, polished look.",
        image: "/images/service4.jpeg"
      },
      {
        name: "U-Cut",
        description: "A soft, rounded haircut that forms a “U” shape at the back, adding natural volume and bounce.",
        image: "/images/service5.jpeg"
      },
      {
        name: "V-Cut",
        description: "A haircut with a sharp “V” shape at the back, creating dramatic layers and a stylish silhouette.",
        image: "/images/service6.jpeg"
      },
      {
        name: "Feather Cut",
        description: "A layered haircut with soft, wispy ends that add lightness and texture for a feather-like appearance.",
        image: "/images/service7.jpeg"
      },
      {
        name: "Step Cut",
        description: "A layered haircut with distinct, visible steps creating volume and dimension.",
        image: "/images/service8.jpeg"
      },
      {
        name: "Layer Cut",
        description: "A haircut with multiple layers to add movement, texture, and body to the hair.",
        image: "/images/service9.jpeg"
      },
      {
        name: "Front Cut",
        description: "A haircut focusing on shaping the front sections, like bangs or fringes, to frame the face beautifully.",
        image: "/images/service10.jpeg"
      }
    ]
  },

  facials: {
    title: "Facials",
    items: [
      {
        name: "Gold Facial",
        description: "Luxurious facial with gold particles for glowing skin.",
        image: "/images/service11.jpeg"
      },
      {
        name: "Fruit Facial",
        description: "A refreshing facial using natural fruit extracts to nourish and revitalize the skin.",
        image: "/images/service12.jpeg"
      },
      {
        name: "Shahnaz Facial",
        description: "A traditional herbal facial that rejuvenates and brightens the skin using natural ingredients.",
        image: "/images/service13.jpeg"
      },
      {
        name: "Anti-Aging Facial",
        description: "A treatment designed to reduce wrinkles and fine lines, promoting youthful, firm skin.",
        image: "/images/service14.jpeg"
      },
      {
        name: "Anti-Pigmentation Facial",
        description: "A specialized facial that targets and lightens dark spots for an even skin tone.",
        image: "/images/service15.jpeg"
      },
      {
        name: "Brightening Facial",
        description: "A rejuvenating facial that enhances skin radiance and restores a healthy glow.",
        image: "/images/service16.jpeg"
      }
    ]
  },

  waxing: {
    title: "Waxing",
    items: [
      {
        name: "Full Leg Wax",
        description: "Smooth and hair-free legs for weeks.",
        image: "/images/service17.jpeg"
      },
      {
        name: "Full Hand Wax",
        description: "Leaves your hands smooth and hair-free.",
        image: "/images/service18.jpeg"
      },
      {
        name: "Underarm Wax",
        description: "Clean and smooth underarms.",
        image: "/images/service19.jpeg"
      }
    ]
  },

  threading: {
    title: "Threading",
    items: [
      {
        name: "Eyebrow Threading",
        description: "Precise and gentle eyebrow shaping.",
        image: "/images/service20.jpeg"
      },
      {
        name: "Upper Lip Threading",
        description: "Soft removal of hair from upper lip area.",
        image: "/images/service21.jpeg"
      }
    ]
  },

  manicure: {
    title: "Manicure",
    items: [
      {
        name: "Manicure Service",
        description: "A relaxing treatment to clean, shape, and beautify your hands and nails.",
        image: "/images/service23.jpeg"
      },
      {
        name: "Manicure Polish",
        description: "Enhance your nails with smooth polish and a flawless finish.",
        image: "/images/service22.jpeg"
      }
    ]
  },

  pedicure: {
    title: "Pedicure",
    items: [
      {
        name: "Pedicure Service",
        description: "A soothing treatment to refresh and groom your feet and toenails.",
        image: "/images/service24.jpeg"
      },
      {
        name: "Pedicure Spa",
        description: "Relax your feet with a luxurious soak, scrub, and polish.",
        image: "/images/service25.jpeg"
      }
    ]
  },

  "bridal-makeup": {
    title: "Bridal Makeup",
    items: [
      {
        name: "Traditional Bridal",
        description: "Elegant makeup for traditional weddings.",
        image: "/images/service26.jpeg"
      },
      {
        name: "Modern Bridal",
        description: "Contemporary style bridal makeup.",
        image: "/images/service27.jpeg"
      }
    ]
  }
};

const Services = () => {
  const { serviceName } = useParams();
  const service = servicesData[serviceName];

  if (!service) {
    return (
      <div className="services-container">
        <h2>Service not found</h2>
        <p>Please select a valid service from the dropdown menu.</p>
      </div>
    );
  }

  return (
    <div className="services-container">
      <h2>{service.title}</h2>
      <div className="cards-container">
        {service.items.map((item, index) => (
          <div key={index} className="service-card">
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
