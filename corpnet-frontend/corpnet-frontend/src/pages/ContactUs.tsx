import React, { useState, ChangeEvent, FormEvent } from "react";
import { useToast } from "@/components/ui/use-toast"; // shadcn toast hook

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const { toast } = useToast();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // show a pretty toast instead of alert
    toast({
      title: "Message Sent ✅",
      description: "Thank you for contacting Cropnet! We’ll get back to you soon.",
      duration: 4000,
    });

    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-green-700 mb-6">Contact Us</h1>
      <p className="text-lg text-gray-700 mb-8">
        Have a question, suggestion, or need help? We’d love to hear from you.
        Fill out the form below and our team will get back to you as soon as
        possible.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-green-50 p-6 rounded-xl shadow-md"
      >
        <div>
          <label className="block text-gray-800 font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-gray-800 font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-gray-800 font-medium mb-2">Message</label>
          <textarea
            name="message"
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
        >
          Send Message
        </button>
      </form>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-green-700 mb-4">Our Office</h2>
        <p className="text-gray-700">📍 Lahore, Pakistan</p>
        <p className="text-gray-700">📞 +92 300 1234567</p>
        <p className="text-gray-700">✉ support@cropnet.com</p>
      </div>
    </div>
  );
};

export default ContactUs;
