import { LayoutMetrics } from './scoring-utils';
import { SeatingAssignment } from '../types';

export const generateLayoutExplanation = (metrics: LayoutMetrics, assignments: SeatingAssignment[]): string => {
    const { academicBalance, socialCompatibility, behavioralHarmony, overallScore } = metrics;

    const intro = [
        `Genetik algoritma, sınıf için %${overallScore} genel uyum puanına sahip bir düzen oluşturdu.`,
        `Optimizasyon tamamlandı — bu düzen %${overallScore} oranında dengeli bir sınıf ortamı sağlıyor.`,
        `Evrimsel seçilim sonucu, sınıf düzeni %${overallScore} genel uyumla optimize edildi.`
    ];

    const academicNote = academicBalance > 80
        ? "Güçlü öğrenciler, desteğe ihtiyaç duyan arkadaşlarının yanına yerleştirilerek akran öğrenmesi destekleniyor."
        : "Akademik düzeyler sınıf genelinde dengeli dağıtılarak bilgi gruplarının oluşması önlendi.";

    const socialNote = socialCompatibility > 80
        ? "Arkadaşlık uyumu yüksek tutularak olumlu bir sosyal ortam sağlandı."
        : "Sosyal sürtüşme, komşuluk eşleştirmeleri dikkatli yönetilerek en aza indirildi.";

    const behaviorNote = behavioralHarmony > 80
        ? "Dikkat dağıtıcı etkiler, davranışsal kümelenmelerin ayrılmasıyla önemli ölçüde azaltıldı."
        : "Lider öğrenciler stratejik noktalara yerleştirilerek sınıf dinamikleri iyileştirildi.";

    const selectedIntro = intro[Math.floor(Math.random() * intro.length)];

    return `${selectedIntro} ${academicNote} ${socialNote} ${behaviorNote} Özel gereksinimleri olan öğrenciler ön sıralarda önceliklendirilerek erişilebilirlik sağlandı.`;
};
