import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Target, Users } from 'lucide-react';
import { Caption, Paper, Pointer, LevelMeter, ease, EASE_IN_OUT } from '../components';
import { AppFrame, abs, PrimaryButton } from '../AppFrame';
import { C, FONT_DISPLAY } from '../theme';
import data from '../data.json';

const byId = Object.fromEntries(data.students.map(s => [s.id, s]));
const RANK: Record<string, number> = { high: 5, above_average: 4, average: 3, below_average: 2, struggling: 1 };
const sorted = [...data.students].sort((a, b) => RANK[b.academicLevel] - RANK[a.academicLevel]);

const TX0 = 344, TW = 165, TDX = 177, CHIP_Y0 = 150, CHIP_DY = 88, CHIP_H = 76;
const CLICK = 40, MIX = 48, SWITCH = 150, SIM = 158;

const slot = (teams: { ids: string[] }[]) => {
  const m: Record<string, { t: number; k: number }> = {};
  teams.forEach((t, ti) => t.ids.forEach((id, k) => (m[id] = { t: ti, k })));
  return m;
};
const mixSlots = slot(data.teams.mixed), simSlots = slot(data.teams.similar);
const TEAM_TONE = [C.primary, C.accent, C.indigo, C.brick];

export const Teams: React.FC = () => {
  const frame = useCurrentFrame();
  const similar = frame >= SWITCH;
  const btn = abs(176, 470);
  const toggle = abs(176, 300);
  return (
    <Paper>
      <Caption
        step="04 · Group work"
        title={<>Balanced teams, or groups by level.</>}
        sub={similar
          ? 'Switch to similar levels for targeted practice: groups average 5.0, 4.3, 3.0 and 1.5.'
          : 'Balanced mode spreads strong and struggling students evenly: every team averages 3.3 to 3.7 out of 5.'}
      />
      <AppFrame tab="teams">
        <div style={{ position: 'absolute', left: 36, top: 20, width: 280, background: C.card, border: `1px solid ${C.borderLight}`, borderRadius: 18, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 900, fontSize: 18 }}><Users size={18} strokeWidth={2.2} /> Takım Kuralları</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.text2, marginTop: 16 }}>Takım sayısı</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            {[2, 3, 4, 5].map(n => (
              <div key={n} style={{ flex: 1, textAlign: 'center', padding: '8px 0', borderRadius: 10, fontWeight: 900, fontSize: 18, background: n === 4 ? C.text : C.muted, color: n === 4 ? '#fff' : C.text2 }}>{n}</div>
            ))}
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.text2, marginTop: 18 }}>Dağıtım stratejisi</div>
          {[{ l: 'Dengeli Dağılım', d: 'Her takımda farklı seviyeler' }, { l: 'Benzer Seviyeler', d: 'Aynı seviyeler bir arada' }].map((o, i) => {
            const on = (i === 1) === similar;
            return (
              <div key={o.l} style={{ marginTop: 8, padding: '10px 12px', borderRadius: 12, border: `1.5px solid ${on ? C.primary : C.borderLight}`, background: on ? C.primaryPale : 'transparent' }}>
                <div style={{ fontWeight: 900, fontSize: 16, color: on ? C.primaryDark : C.text }}>{o.l}</div>
                <div style={{ fontWeight: 600, fontSize: 13, color: C.text3 }}>{o.d}</div>
              </div>
            );
          })}
          <PrimaryButton label="Takımları Oluştur" icon={<Target size={18} strokeWidth={2.2} />} pressed={frame >= CLICK && frame < CLICK + 6 ? 1 : 0} style={{ marginTop: 18, fontSize: 18 }} />
        </div>

        {/* team columns */}
        {[0, 1, 2, 3].map(t => {
          const team = (similar ? data.teams.similar : data.teams.mixed)[t];
          const shownAvg = interpolate(ease(frame, [SIM + 20, SIM + 50], [0, 1]), [0, 1], [data.teams.mixed[t].avg, data.teams.similar[t].avg]);
          const head = ease(frame - MIX - t * 4, [0, 14], [0, 1]);
          return (
            <div key={t} style={{ position: 'absolute', left: TX0 + t * TDX, top: 20, width: TW, opacity: head }}>
              <div style={{ height: 4, borderRadius: 2, background: TEAM_TONE[t] }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 12 }}>
                <span style={{ fontWeight: 900, fontSize: 19 }}>Takım {t + 1}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: C.text3 }}>{team.ids.length} kişi</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{shownAvg.toFixed(1)}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: C.text3 }}>/ 5 ort.</span>
              </div>
            </div>
          );
        })}
        {sorted.map((s, i) => {
          // waiting pile, sorted by level (top-left of the team area)
          const px = TX0 + (i % 5) * 140, py = 540 + Math.floor(i / 5) * 86;
          const m = mixSlots[s.id], q = simSlots[s.id];
          const mx = TX0 + m.t * TDX, my = CHIP_Y0 + m.k * CHIP_DY;
          const sx = TX0 + q.t * TDX, sy = CHIP_Y0 + q.k * CHIP_DY;
          const p1 = ease(frame, [MIX + i * 3, MIX + i * 3 + 22], [0, 1], EASE_IN_OUT);
          const p2 = ease(frame, [SIM + i * 2, SIM + i * 2 + 22], [0, 1], EASE_IN_OUT);
          const x = interpolate(p2, [0, 1], [interpolate(p1, [0, 1], [px, mx]), sx]);
          const y = interpolate(p2, [0, 1], [interpolate(p1, [0, 1], [py, my]), sy]);
          const lift = Math.max(Math.sin(p1 * Math.PI), Math.sin(p2 * Math.PI));
          const appear = ease(frame - i * 1.5, [0, 10], [0, 1]);
          const team = p2 > 0.5 ? q.t : p1 > 0.5 ? m.t : -1;
          return (
            <div
              key={s.id}
              style={{
                position: 'absolute', left: x, top: y, width: p1 > 0.5 ? TW : 128, height: CHIP_H, borderRadius: 14,
                background: C.card, border: `1.5px solid ${team >= 0 ? `${TEAM_TONE[team]}66` : C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px',
                opacity: appear, zIndex: lift > 0.05 ? 5 : 1,
                boxShadow: lift > 0.05 ? `0 ${8 * lift}px ${20 * lift}px rgba(26,23,21,${0.14 * lift})` : 'none',
              }}
            >
              <span style={{ fontWeight: 800, fontSize: 21 }}>{byId[s.id].name}</span>
              <LevelMeter level={s.academicLevel} size={6} />
            </div>
          );
        })}
      </AppFrame>
      <Pointer
        path={[{ f: 4, x: 700, y: 980 }, { f: CLICK - 2, x: btn.x, y: btn.y }, { f: SWITCH - 14, x: toggle.x, y: toggle.y }, { f: SWITCH + 20, x: toggle.x + 10, y: toggle.y + 20 }, { f: SWITCH + 40, x: 500, y: 1080 }]}
        clickAt={[CLICK, SWITCH - 4]}
      />
    </Paper>
  );
};
