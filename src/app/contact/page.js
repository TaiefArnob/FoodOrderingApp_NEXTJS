"use client";

import React, { useState } from "react";
import { FiSend, FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const Contact = () => {
  const [message, setMessage] = useState("");

  const handleWhatsApp = () => {
    const phone = "8801682926129";
    const encoded = encodeURIComponent(message || "Hello! I’d like to make an inquiry.");
    window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
  };

  return (
    <section className="bg-gradient-to-br from-amber-100 via-orange-50 to-amber-100 min-h-screen py-20 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-[#4b0000] mb-4">
          Contact <span className="text-amber-500">Pipra Kitchen</span>
        </h1>
        <p className="text-center text-[#4b0000] text-lg max-w-2xl mx-auto mb-12">
          Let’s connect! For reservations, feedback, or catering — we’re just a message away.
        </p>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Contact Details */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-l-4 border-amber-400 space-y-6">
            <h2 className="text-2xl font-semibold text-[#4b0000]">Get in Touch</h2>

            <div className="space-y-4 text-[#4b0000] text-base">
              <div className="flex items-start gap-3">
                <FiMapPin className="text-amber-500 text-xl mt-1" />
                <p>
                  Sonargaon Janapath Road, Plot 1 (Chondol Bhog Road), opposite Diyabari Uttara Fire Station,
                  <br /> Uttarati, Bangladesh
                </p>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone className="text-amber-500 text-xl" />
                <a href="tel:01682926129" className="hover:text-amber-500 transition">
                  01682-926129
                </a>
              </div>
              <div className="flex items-center gap-3">
                <FiMail className="text-amber-500 text-xl" />
                <a href="mailto:Anannatitila31@gmail.com" className="hover:text-amber-500 transition">
                  Anannatitila31@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Message Form */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-l-4 border-amber-400 space-y-6">
            <h2 className="text-2xl font-semibold text-[#4b0000]">Send us a Message</h2>

            <textarea
              rows="6"
              placeholder="Write your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-4 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-[#4b0000]"
            />

            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-[#4b0000] font-semibold px-6 py-3 rounded-full transition duration-300 shadow-md w-full"
            >
              <FaWhatsapp className="text-xl" />
              Send via WhatsApp
            </button>
          </div>
        </div>

        {/* Embedded Map */}
        <div className="mt-16 rounded-2xl overflow-hidden shadow-2xl border border-amber-300">
          <iframe
            title="Pipra Kitchen Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.661405904964!2d90.35601587440254!3d23.760146688369203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c1248aa91cc9%3A0x49e6e96dd4e9ad6c!2sChandol%20Bhog%20Road%2C%20Dhaka%201234!5e0!3m2!1sen!2sbd!4v1721770549991!5m2!1sen!2sbd"
            width="100%"
            height="420"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Contact;
