import AnimatedContent from "@/AnimatedContent/AnimatedContent";

export default function NotFound() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
      <AnimatedContent
        distance={150}
        direction="vertical"
        duration={1}
        ease="power3.out"
        animateOpacity
      >
        <div className="flex flex-col items-center justify-center h-screen text-center">
          <h1 className="text-7xl font-extrabold text-red-600">404</h1>
          <p className="mt-4 text-xl text-gray-700">
            Oops! This page doesn't exist.
          </p>
          <a
            href="/"
            className="mt-6 px-6 py-2 bg-[#4077D0] hover:bg-[#3763BE] text-white rounded-lg shadow transition"
          >
            Back
          </a>
        </div>
      </AnimatedContent>
    </div>
  );
}
