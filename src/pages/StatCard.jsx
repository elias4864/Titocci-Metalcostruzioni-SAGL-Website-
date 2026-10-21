import React from 'react';
import CountUpComponent from 'react-countup';
import { useInView } from 'react-intersection-observer';

export default function StatCard({ value, label, suffix = "" }) {

    const CountUp = CountUpComponent.default || CountUpComponent;
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <div ref={ref} className="stat-item">
      <span className="stat-number">
        {inView ? <CountUp end={value} duration={2.5} suffix={suffix} /> : "0"}
      </span>
            <span className="stat-text">{label}</span>
        </div>
    );
}