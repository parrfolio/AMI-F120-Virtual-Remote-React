export const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-metropolis-bold text-gray-900 mb-6">
          About AMi F-120 Jukebox
        </h1>
        
        <div className="prose max-w-none">
          <p className="text-lg text-gray-700 mb-4">
            This is a virtual remote control interface for the AMi F-120 Jukebox.
            It allows you to control song selection and LED light animations via a web interface.
          </p>
          
          <h2 className="text-2xl font-metropolis-bold text-gray-900 mt-8 mb-4">
            Features
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Remote song selection via stepper motor control</li>
            <li>Customizable LED light animations</li>
            <li>Real-time control via WebSocket communication</li>
            <li>User authentication and authorization</li>
          </ul>
          
          <h2 className="text-2xl font-metropolis-bold text-gray-900 mt-8 mb-4">
            Technology Stack
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>React 18 with TypeScript</li>
            <li>Tailwind CSS for styling</li>
            <li>Zustand for state management</li>
            <li>React Query for server state</li>
            <li>Firebase for authentication</li>
            <li>Socket.IO for real-time communication</li>
            <li>Vite for fast development and building</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
