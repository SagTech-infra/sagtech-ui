'use client';
import { Particles } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="relative w-full max-w-[600px] h-[400px] rounded-16px overflow-hidden bg-black_1">
      <Particles
        quantity={80}
        color="var(--color-pr_purple)"
        size={0.6}
        velocity={0.5}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
      <div className="relative z-1 flex flex-col items-center justify-center h-full text-center">
        <h2 className="font-orbitron text-32 text-white_4">SagTech</h2>
        <p className="font-manrope text-14 text-grey_4 mt-8px">
          Animated particle background
        </p>
      </div>
    </div>
  );
}
