import { ReactNode } from 'react';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 text-white flex-col justify-center items-center p-12">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-8">
            <span className="text-3xl font-bold">H</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">HRFlow</h1>
          <p className="text-lg text-blue-100 leading-relaxed">
            Modern HR management for growing teams. Attendance, payroll,
            recruitment, and learning — all in one clean platform.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4 text-sm text-blue-100">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="font-semibold text-white text-2xl">99.9%</p>
              <p>Uptime SLA</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="font-semibold text-white text-2xl">10k+</p>
              <p>Active Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form area */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
