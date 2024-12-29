import Link from "next/link";

const WhatsAppButton = () => {
  const phoneNumber = "+2347061647972";
  const message = "Hello, I have a question about your services.";

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <Link
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className=" text-white px-4 py-2 "
    >
      Chat on WhatsApp
    </Link>
  );
};

export default WhatsAppButton;
