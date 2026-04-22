"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', textAlign: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '800px' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, #3b82f6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Scalable Task Management
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#aaa', marginBottom: '3rem', lineHeight: '1.6' }}>
          A secure, high-performance REST API with Role-Based Access Control and a modern, premium user interface. Built for speed and scalability.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <Link href="/login" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            Get Started
          </Link>
          <Link href="/register" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
            Create Account
          </Link>
        </div>
        
        <div style={{ marginTop: '5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          <div>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>FastAPI</h3>
            <p style={{ fontSize: '0.9rem', color: '#888' }}>High-performance Python backend with auto-docs.</p>
          </div>
          <div>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>JWT Auth</h3>
            <p style={{ fontSize: '0.9rem', color: '#888' }}>Secure stateless authentication with role hierarchy.</p>
          </div>
          <div>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Next.js 14</h3>
            <p style={{ fontSize: '0.9rem', color: '#888' }}>Modern React framework for the best user experience.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
