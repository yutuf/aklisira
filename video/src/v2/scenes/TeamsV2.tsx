import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Target, Users } from 'lucide-react';
import { Paper, Pointer, LevelMeter, ease, EASE_IN_OUT } from '../../components';
import { C, FONT_DISPLAY } from '../../theme';
import { Stage, CutIn } from '../layout';
import { Cap, Chrome, Watermark } from '../ui';
import data from '../../data.json';

const byId = Object.fromEntries(data.students.map(s => [s.id, s]));
const RANK: Record<string, number> = { high: 5, above_average: 4, average: 3, below_average: 2, struggling: 1 };
const sorted = [...data.students].sort((a, b) => RANK[b.academicLevel] - RANK[a.academicLevel]);
const slot = (teams: { ids: string[] }[]) => {
  const m: Record<string, { t: number; k: number }> = {};
  teams.forEach((t, ti) => t.ids.forEach((id, k) => (m[id] = { t: ti, k })));
  return m;
};
const MIXS = slot(data.teams.mixed), SIMS = slot(data.teams.similar);
const TONE = [C.primary, C.accent, C.indigo, C.brick];
const TX0 = 344, TW = 165, TDX = 177, Y0 = 250, DY = 90, CH = 78;
const CLICK = 26, MIX = 32, SWITCH = 98, SIM = 104;

export const TeamsV2: React.FC = () => {
  const frame = useCurrentFrame();
  const similar = frame >= SWITCH;
  return (
    <Paper>
      <CutIn>
        <Cap out={SWITCH - 6} step="03 · Group work" title={<>Fair teams in one click.</>}
          sub="Balanced mode spreads levels evenly: every team averages 3.3 to 3.7 out of 5." />
        <Cap at={SWITCH} step="03 · Group work" title={<>Or group by level.</>}
          sub="Similar-level groups for targeted practice: 5.0, 4.3, 3.0 and 1.5." />
        <Stage>
          <Chrome tab="teams" />
          <div style={{ position: 'absolute', left: 36, top: 90, width: 280, background: C.card, border: `1px solid ${C.borderLight}`, borderRadius: 18, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 900, fontSize: 19 }}><Users size={19} strokeWidth={2.2} /> Takım Kuralları</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: C.text2, marginTop: 16 }}>Takım sayısı</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              {[2, 3, 4, 5].map(n => <div key={n} style={{ flex: 1, textAlign: 'center', padding: '9px 0', borderRadius: 10, fontWeight: 900, fontSize: 19, background: n === 4 ? C.text : C.muted, color: n === 4 ? '#fff' : C.text2 }}>{n}</div>)}
            </div>
            <div style={{ fontSize: 16, fontWeight: 900, color: C.text2, marginTop: 18 }}>Dağıtım</div>
            {['Dengeli Dağılım', 'Benzer Seviyeler'].map((l, i) => {
              const on = (i === 1) === similar;
              return <div key={l} style={{ marginTop: 8, padding: '12px 14px', borderRadius: 12, fontWeight: 900, fontSize: 18, border: `1.5px solid ${on ? C.primary : C.borderLight}`, background: on ? C.primaryPale : 'transparent', color: on ? C.primaryDark : C.text2, transform: `scale(${i === 1 && frame >= SWITCH - 4 && frame < SWITCH + 1 ? 0.96 : 1})` }}>{l}</div>;
            })}
            <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, height: 58, borderRadius: 14, background: C.primary, color: '#fff', fontWeight: 900, fontSize: 19, transform: `scale(${frame >= CLICK && frame < CLICK + 5 ? 0.95 : 1})` }}>
              <Target size={19} strokeWidth={2.2} /> Takımları Oluştur
            </div>
          </div>
          {[0, 1, 2, 3].map(t => {
            const avg = interpolate(ease(frame, [SIM + 14, SIM + 40], [0, 1]), [0, 1], [data.teams.mixed[t].avg, data.teams.similar[t].avg]);
            const head = ease(frame - MIX - t * 3, [0, 12], [0, 1]);
            return (
              <div key={t} style={{ position: 'absolute', left: TX0 + t * TDX, top: 92, width: TW, opacity: head }}>
                <div style={{ height: 5, borderRadius: 3, background: TONE[t] }} />
                <div style={{ fontWeight: 900, fontSize: 20, marginTop: 12 }}>Takım {t + 1}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                  <span style={{ fontFamily: FONT_DISPLAY, fontSize: 44, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{avg.toFixed(1)}</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.text3 }}>/ 5 ort.</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: C.muted, marginTop: 6 }}>
                  <div style={{ width: `${(avg / 5) * 100}%`, height: 8, borderRadius: 4, background: TONE[t] }} />
                </div>
              </div>
            );
          })}
          {sorted.map((s, i) => {
            const px = TX0 + (i % 5) * 140, py = 560 + Math.floor(i / 5) * 92;
            const m = MIXS[s.id], q = SIMS[s.id];
            const p1 = ease(frame, [MIX + i * 2.2, MIX + i * 2.2 + 18], [0, 1], EASE_IN_OUT);
            const p2 = ease(frame, [SIM + i * 1.6, SIM + i * 1.6 + 18], [0, 1], EASE_IN_OUT);
            const x = interpolate(p2, [0, 1], [interpolate(p1, [0, 1], [px, TX0 + m.t * TDX]), TX0 + q.t * TDX]);
            const y = interpolate(p2, [0, 1], [interpolate(p1, [0, 1], [py, Y0 + m.k * DY]), Y0 + q.k * DY]);
            const lift = Math.max(Math.sin(p1 * Math.PI), Math.sin(p2 * Math.PI));
            const team = p2 > 0.5 ? q.t : p1 > 0.5 ? m.t : -1;
            return (
              <div key={s.id} style={{
                position: 'absolute', left: x, top: y, width: p1 > 0.5 ? TW : 130, height: CH, borderRadius: 14, background: C.card,
                border: `2px solid ${team >= 0 ? `${TONE[team]}77` : C.border}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6, padding: '0 14px',
                opacity: ease(frame - i, [0, 8], [0, 1]), zIndex: lift > 0.05 ? 5 : 1,
                boxShadow: lift > 0.05 ? `0 ${10 * lift}px ${22 * lift}px rgba(26,23,21,${0.16 * lift})` : 'none',
              }}>
                <span style={{ fontWeight: 900, fontSize: 22 }}>{byId[s.id].name}</span>
                <LevelMeter level={s.academicLevel} size={6} />
              </div>
            );
          })}
          <Pointer path={[{ f: 0, x: 500, y: 860 }, { f: CLICK - 2, x: 200, y: 424 }, { f: SWITCH - 16, x: 180, y: 372 }, { f: SWITCH + 16, x: 200, y: 400 }, { f: SWITCH + 34, x: 100, y: 900 }]} clickAt={[CLICK, SWITCH - 4]} />
        </Stage>
        <Watermark />
      </CutIn>
    </Paper>
  );
};
