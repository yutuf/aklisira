"use client";

import React, { useMemo } from 'react';
import { Student } from '../types';

interface ClassStatsProps {
  students: Student[];
}

export default function ClassStats({ students }: ClassStatsProps) {
  const stats = useMemo(() => {
    if (students.length === 0) return null;

    const academicCounts = {
      high: students.filter(s => s.academicLevel === 'high').length,
      above_average: students.filter(s => s.academicLevel === 'above_average').length,
      average: students.filter(s => s.academicLevel === 'average').length,
      below_average: students.filter(s => s.academicLevel === 'below_average').length,
      struggling: students.filter(s => s.academicLevel === 'struggling').length,
    };

    const behaviorCounts = {
      quiet: students.filter(s => s.behaviorType === 'quiet').length,
      disruptive: students.filter(s => s.behaviorType === 'disruptive').length,
      leader: students.filter(s => s.behaviorType === 'leader').length,
    };

    const specialNeedsCount = students.filter(s => s.specialNeeds !== 'none').length;

    return { academicCounts, behaviorCounts, specialNeedsCount };
  }, [students]);

  if (!stats) return null;

  const { academicCounts, behaviorCounts, specialNeedsCount } = stats;
  const getPercentage = (count: number) => Math.round((count / students.length) * 100);

  return (
    <div className="card animate-fade-in" style={{ padding: '16px' }}>
      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
        <span>📊 SINIF PROFİLİ</span>
        <span>{students.length} Öğrenci</span>
      </div>

      {/* Academic Distribution */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Akademik Dağılım</div>
        <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', background: 'var(--bg-muted)' }}>
          <div style={{ width: `${getPercentage(academicCounts.high)}%`, background: '#0d6e64' }} title="Yüksek" />
          <div style={{ width: `${getPercentage(academicCounts.above_average)}%`, background: '#14b8a6' }} title="Ort. Üstü" />
          <div style={{ width: `${getPercentage(academicCounts.average)}%`, background: '#94a3b8' }} title="Ortalama" />
          <div style={{ width: `${getPercentage(academicCounts.below_average)}%`, background: '#f59e0b' }} title="Ort. Altı" />
          <div style={{ width: `${getPercentage(academicCounts.struggling)}%`, background: '#ef4444' }} title="Zorlanan" />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px', fontSize: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0d6e64' }} />
            <span>Yük: {academicCounts.high}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#14b8a6' }} />
            <span>O.Ü: {academicCounts.above_average}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} />
            <span>Zor: {academicCounts.struggling}</span>
          </div>
        </div>
      </div>

      {/* Social/Behavior Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div style={{ padding: '8px', background: 'var(--bg-muted)', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>{behaviorCounts.disruptive}</div>
          <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)' }}>HAYLAZ / HAREKETLİ</div>
        </div>
        <div style={{ padding: '8px', background: 'var(--bg-muted)', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent)' }}>{specialNeedsCount}</div>
          <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)' }}>ÖZEL GEREKSİNİM</div>
        </div>
      </div>
    </div>
  );
}
