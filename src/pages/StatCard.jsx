import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

export default function StatCard({ value, label, suffix = "" }) {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.3,
    });

    return (
        <div ref={ref} style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#e62b2b' }}>
                {inView ? <CountUp end={Number(value)} duration={2.5} separator="" /> : 0}
                {suffix}
            </div>
            <div style={{ fontSize: '1rem', color: '#666', marginTop: '5px' }}>
                {label}
            </div>
        </div>
    );
}