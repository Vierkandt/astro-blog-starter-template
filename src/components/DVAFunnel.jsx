import { useState, useEffect, useRef } from "react";

const PRICE_DAY = 7.5;
const PRICE_TWOWEEK = 75;
const PRICE_BESTE = 150;

const C = {
  orange: "#F47B20",
  orangeDark: "#D96A10",
  orangeDeep: "#B85A0A",
  orangeLight: "#FFF4EB",
  orangeMid: "#FDEBD4",
  white: "#FFFFFF",
  offWhite: "#FAFAFA",
  grey100: "#F5F5F5",
  grey200: "#EBEBEB",
  grey400: "#B0B0B0",
  grey600: "#666666",
  grey800: "#333333",
  dark: "#1A1A1A",
};

const tiers = [
  {
    id: "vriend",
    label: "Vriend",
    subtitle: "Vanaf €7,50",
    description: "Steun DVA met dagkaarten",
    emoji: "🤝",
    accent: C.orange,
  },
  {
    id: "goede_vriend",
    label: "Goede Vriend",
    subtitle: "Vanaf €75",
    description: "Een tweeweekenkaart + optioneel dagkaarten",
    emoji: "🧡",
    accent: C.orangeDark,
  },
  {
    id: "beste_vriend",
    label: "Beste Vriend",
    subtitle: "Vanaf €150",
    description: "Twee tweeweekenkaarten + optioneel dagkaarten",
    emoji: "🌟",
    accent: C.orangeDeep,
  },
];

function formatEuro(n) {
  return n % 1 === 0 ? `€${n}` : `€${n.toFixed(2).replace(".", ",")}`;
}

function FadeIn({ children, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(14px)",
        transition: "opacity 0.45s ease, transform 0.45s ease",
      }}
    >
      {children}
    </div>
  );
}

const Btn = ({ children, onClick, variant = "primary", accent = C.orange, style = {}, ...rest }) => {
  const base = {
    width: "100%",
    padding: "14px 20px",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: "none",
    fontFamily: "inherit",
    ...style,
  };
  const variants = {
    primary: {
      ...base,
      background: accent,
      color: C.white,
      boxShadow: `0 2px 8px ${accent}33`,
    },
    secondary: {
      ...base,
      background: C.white,
      color: C.grey600,
      border: `1.5px solid ${C.grey200}`,
      boxShadow: "none",
    },
    ghost: {
      ...base,
      background: "none",
      color: C.orange,
      fontSize: 13,
      fontWeight: 500,
      padding: "8px 0",
      textDecoration: "underline",
      textUnderlineOffset: 3,
      width: "auto",
    },
  };
  return (
    <button
      onClick={onClick}
      style={variants[variant]}
      onMouseEnter={(e) => {
        if (variant === "primary") {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = `0 4px 14px ${accent}44`;
        }
        if (variant === "secondary") e.currentTarget.style.borderColor = C.orange;
      }}
      onMouseLeave={(e) => {
        if (variant === "primary") {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = `0 2px 8px ${accent}33`;
        }
        if (variant === "secondary") e.currentTarget.style.borderColor = C.grey200;
      }}
      {...rest}
    >
      {children}
    </button>
  );
};

export default function DVAFunnel() {
  const [step, setStep] = useState("type");
  const [selectedTier, setSelectedTier] = useState(null);
  const [dayCards, setDayCards] = useState(1);
  const [twoWeekCards, setTwoWeekCards] = useState(1);
  const [showBestePopup, setShowBestePopup] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

  const totalPrice = () => {
    if (selectedTier === "vriend") return dayCards * PRICE_DAY;
    if (selectedTier === "goede_vriend") return twoWeekCards * PRICE_TWOWEEK + dayCards * PRICE_DAY;
    if (selectedTier === "beste_vriend") return twoWeekCards * PRICE_TWOWEEK + dayCards * PRICE_DAY;
    return 0;
  };

  const resetAndGo = (tierOverride, stepOverride) => {
    if (tierOverride === "vriend") { setDayCards(1); setTwoWeekCards(0); }
    else if (tierOverride === "goede_vriend") { setTwoWeekCards(1); setDayCards(0); }
    else if (tierOverride === "beste_vriend") { setTwoWeekCards(2); setDayCards(0); }
    setSelectedTier(tierOverride);
    setStep(stepOverride || "configure");
  };

  const handleContinue = () => {
    if (selectedTier === "vriend" && (dayCards === 8 || dayCards === 9)) {
      setStep("upsell");
    } else if (selectedTier === "goede_vriend" && (dayCards === 8 || dayCards === 9)) {
      setStep("upsell");
    } else {
      setStep("confirm");
    }
  };

  const stepOrder = ["type", "tier", "configure", "confirm"];
  const stepLabels = { type: "Type", tier: "Niveau", configure: "Keuze", confirm: "Bevestig" };
  const currentIdx = stepOrder.indexOf(step === "upsell" ? "confirm" : step === "done" ? "confirm" : step);
  const tier = selectedTier ? tiers.find((t) => t.id === selectedTier) : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.offWhite,
        fontFamily: "'Nunito', 'DM Sans', 'Segoe UI', system-ui, sans-serif",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "32px 16px",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      <div
        ref={containerRef}
        style={{
          width: "100%",
          maxWidth: 480,
          background: C.white,
          borderRadius: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 30px rgba(0,0,0,0.04)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Header bar */}
        <div
          style={{
            background: C.orange,
            padding: "24px 28px 20px",
            color: C.white,
          }}
        >
          <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.85, marginBottom: 2, fontWeight: 700 }}>
            Stichting DVA
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, lineHeight: 1.3 }}>
            Word Vriend van DVA
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, opacity: 0.8, lineHeight: 1.4, fontWeight: 500 }}>
            Omdat ieder kind een zorgeloze vakantie verdient
          </p>
        </div>

        {/* Progress steps */}
        {step !== "done" && (
          <div style={{ padding: "14px 28px 0", display: "flex", gap: 6 }}>
            {stepOrder.map((s, i) => (
              <div key={s} style={{ flex: 1, textAlign: "center" }}>
                <div
                  style={{
                    height: 3,
                    borderRadius: 2,
                    background: i <= currentIdx ? C.orange : C.grey200,
                    transition: "background 0.4s",
                    marginBottom: 4,
                  }}
                />
                <span style={{ fontSize: 10, fontWeight: 600, color: i <= currentIdx ? C.orange : C.grey400 }}>
                  {stepLabels[s]}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div style={{ padding: "22px 28px 28px" }}>

          {/* TYPE SELECTION */}
          {step === "type" && (
            <FadeIn>
              <p style={{ fontSize: 15, color: C.grey600, marginTop: 0, marginBottom: 18, lineHeight: 1.5 }}>
                Welkom! Bent u een particulier of zakelijke donateur?
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: "🏠", label: "Particulier", sub: "Ik wil als persoon doneren", go: () => setStep("tier"), primary: true },
                  { icon: "🏢", label: "Zakelijk", sub: "Corporate sponsoring", go: () => setStep("zakelijk"), primary: false },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={opt.go}
                    style={{
                      padding: "16px 18px",
                      border: opt.primary ? `2px solid ${C.orange}` : `1.5px solid ${C.grey200}`,
                      borderRadius: 12,
                      background: C.white,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      transition: "all 0.2s",
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = opt.primary ? C.orangeLight : C.grey100;
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = C.white;
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{opt.icon}</span>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: opt.primary ? C.orangeDark : C.grey800 }}>{opt.label}</div>
                      <div style={{ fontSize: 12, color: C.grey600, marginTop: 1 }}>{opt.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </FadeIn>
          )}

          {/* ZAKELIJK */}
          {step === "zakelijk" && (
            <FadeIn>
              <div style={{ textAlign: "center", padding: "28px 8px" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🏢</div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: C.dark, margin: "0 0 8px" }}>Zakelijke Sponsoring</h2>
                <p style={{ color: C.grey600, fontSize: 14, lineHeight: 1.6, margin: "0 0 20px" }}>
                  Voor zakelijke sponsormogelijkheden nemen wij graag persoonlijk contact met u op.
                </p>
                <a
                  href="#"
                  style={{
                    display: "inline-block",
                    padding: "12px 24px",
                    background: C.orange,
                    color: C.white,
                    borderRadius: 10,
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: 14,
                    marginBottom: 12,
                  }}
                >
                  Naar zakelijke sponsoring →
                </a>
                <br />
                <Btn variant="ghost" onClick={() => setStep("type")}>← Terug</Btn>
              </div>
            </FadeIn>
          )}

          {/* TIER SELECTION */}
          {step === "tier" && (
            <FadeIn>
              <p style={{ fontSize: 15, color: C.grey600, marginTop: 0, marginBottom: 16, lineHeight: 1.5 }}>
                Kies het niveau dat bij u past:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {tiers.map((t, i) => (
                  <FadeIn key={t.id} delay={i * 80}>
                    <button
                      onClick={() => resetAndGo(t.id)}
                      style={{
                        width: "100%",
                        padding: "16px 16px",
                        border: `1.5px solid ${C.grey200}`,
                        borderRadius: 12,
                        background: C.white,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        transition: "all 0.2s",
                        textAlign: "left",
                        fontFamily: "inherit",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = C.orange;
                        e.currentTarget.style.background = C.orangeLight;
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.boxShadow = "0 4px 14px rgba(244,123,32,0.10)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = C.grey200;
                        e.currentTarget.style.background = C.white;
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <span style={{ fontSize: 28 }}>{t.emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 16, color: C.dark }}>{t.label}</div>
                        <div style={{ fontSize: 12, color: C.grey600, marginTop: 2, lineHeight: 1.3 }}>{t.description}</div>
                      </div>
                      <div
                        style={{
                          background: C.orangeLight,
                          padding: "5px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 800,
                          color: C.orangeDark,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {t.subtitle}
                      </div>
                    </button>
                  </FadeIn>
                ))}
              </div>
              <div style={{ marginTop: 14 }}>
                <Btn variant="ghost" onClick={() => setStep("type")}>← Terug</Btn>
              </div>
            </FadeIn>
          )}

          {/* CONFIGURE */}
          {step === "configure" && tier && (
            <FadeIn>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <span style={{ fontSize: 26 }}>{tier.emoji}</span>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.dark }}>{tier.label}</h2>
              </div>

              {/* Two-week card info */}
              {(selectedTier === "goede_vriend" || selectedTier === "beste_vriend") && (
                <div
                  style={{
                    background: C.orangeLight,
                    border: `1px solid ${C.orangeMid}`,
                    borderRadius: 10,
                    padding: "12px 16px",
                    marginBottom: 14,
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.orangeDark, marginBottom: 2 }}>
                    Tweeweekenkaart{twoWeekCards > 1 ? "en" : ""}
                  </div>
                  <div style={{ fontSize: 14, color: C.grey800, fontWeight: 600 }}>
                    {twoWeekCards}× tweeweekenkaart = {formatEuro(twoWeekCards * PRICE_TWOWEEK)}
                  </div>
                </div>
              )}

              {/* Day cards */}
              {selectedTier === "vriend" ? (
                <>
                  <label style={{ fontSize: 13, fontWeight: 700, color: C.grey800, display: "block", marginBottom: 10 }}>
                    Aantal dagkaarten ({formatEuro(PRICE_DAY)} per stuk)
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <button
                        key={n}
                        onClick={() => setDayCards(n)}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 10,
                          border: dayCards === n ? `2px solid ${C.orange}` : `1.5px solid ${C.grey200}`,
                          background: dayCards === n ? C.orangeLight : C.white,
                          cursor: "pointer",
                          fontSize: 17,
                          fontWeight: 700,
                          color: dayCards === n ? C.orangeDark : C.grey600,
                          transition: "all 0.15s",
                          fontFamily: "inherit",
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <label style={{ fontSize: 13, fontWeight: 700, color: C.grey800, display: "block", marginBottom: 10 }}>
                    Extra dagkaarten toevoegen? ({formatEuro(PRICE_DAY)} per stuk)
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
                    <button
                      onClick={() => setDayCards(Math.max(0, dayCards - 1))}
                      disabled={dayCards === 0}
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 10,
                        border: `1.5px solid ${C.grey200}`,
                        background: C.white,
                        cursor: dayCards === 0 ? "default" : "pointer",
                        fontSize: 20,
                        fontWeight: 700,
                        color: dayCards === 0 ? C.grey400 : C.grey800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "inherit",
                      }}
                    >
                      −
                    </button>
                    <span style={{ fontSize: 26, fontWeight: 800, color: C.orangeDark, minWidth: 30, textAlign: "center" }}>
                      {dayCards}
                    </span>
                    <button
                      onClick={() => {
                        const next = dayCards + 1;
                        if (selectedTier === "goede_vriend" && next >= 10) {
                          setDayCards(10);
                          setShowBestePopup(true);
                        } else {
                          setDayCards(next);
                        }
                      }}
                      disabled={selectedTier === "goede_vriend" && dayCards >= 10}
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 10,
                        border: (selectedTier === "goede_vriend" && dayCards >= 10)
                          ? `1.5px solid ${C.grey200}`
                          : `1.5px solid ${C.orange}`,
                        background: (selectedTier === "goede_vriend" && dayCards >= 10) ? C.grey100 : C.orangeLight,
                        cursor: (selectedTier === "goede_vriend" && dayCards >= 10) ? "default" : "pointer",
                        fontSize: 20,
                        fontWeight: 700,
                        color: (selectedTier === "goede_vriend" && dayCards >= 10) ? C.grey400 : C.orangeDark,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "inherit",
                      }}
                    >
                      +
                    </button>
                  </div>
                </>
              )}

              {/* Total */}
              <div
                style={{
                  background: C.grey100,
                  borderRadius: 10,
                  padding: "12px 16px",
                  marginBottom: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 13, color: C.grey600, fontWeight: 600 }}>Jaarlijkse donatie</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: C.orangeDark }}>{formatEuro(totalPrice())}</span>
              </div>

              <Btn onClick={handleContinue} accent={tier.accent}>Ga verder →</Btn>
              <div style={{ marginTop: 10 }}>
                <Btn variant="ghost" onClick={() => setStep("tier")}>← Terug naar niveaus</Btn>
              </div>
            </FadeIn>
          )}

          {/* UPSELL */}
          {step === "upsell" && (
            <FadeIn>
              {(() => {
                const isGoedeUpsell = selectedTier === "goede_vriend";
                const currentTotal = isGoedeUpsell
                  ? twoWeekCards * PRICE_TWOWEEK + dayCards * PRICE_DAY
                  : dayCards * PRICE_DAY;
                const upgradeTier = isGoedeUpsell ? tiers[2] : tiers[1];
                const currentTier = isGoedeUpsell ? tiers[1] : tiers[0];
                const upgradePrice = isGoedeUpsell ? PRICE_BESTE : PRICE_TWOWEEK;
                const diff = upgradePrice - currentTotal;

                return (
                  <div style={{ textAlign: "center", padding: "8px 0" }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>💡</div>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: C.dark, margin: "0 0 10px" }}>Wist u dat?</h2>
                    <p style={{ fontSize: 14, color: C.grey600, lineHeight: 1.6, margin: "0 0 6px" }}>
                      U heeft <strong>{dayCards} dagkaarten</strong> geselecteerd
                      {isGoedeUpsell && <> bovenop uw tweeweekenkaart</>} voor{" "}
                      <strong>{formatEuro(currentTotal)}</strong>.
                    </p>
                    <p style={{ fontSize: 14, color: C.grey600, lineHeight: 1.6, margin: "0 0 18px" }}>
                      {diff > 0 ? (
                        <>
                          Voor slechts <strong style={{ color: C.orangeDark }}>{formatEuro(diff)} meer</strong> kunt u{" "}
                          <strong>{upgradeTier.label}</strong> worden
                          {isGoedeUpsell ? " met twee tweeweekenkaarten" : " met een tweeweekenkaart"} ter waarde van{" "}
                          <strong>{formatEuro(upgradePrice)}</strong>!
                        </>
                      ) : (
                        <>
                          U betaalt al <strong>{formatEuro(currentTotal)}</strong> — word{" "}
                          <strong>{upgradeTier.label}</strong> voor hetzelfde bedrag of minder!
                        </>
                      )}
                    </p>

                    <div
                      style={{
                        background: C.orangeLight,
                        borderRadius: 10,
                        padding: "14px",
                        marginBottom: 16,
                        border: `1px solid ${C.orangeMid}`,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: 11, color: C.grey600, marginBottom: 3, fontWeight: 600 }}>{currentTier.label}</div>
                          <div style={{ fontSize: 17, fontWeight: 800, color: C.grey600 }}>{formatEuro(currentTotal)}</div>
                          <div style={{ fontSize: 10, color: C.grey400 }}>
                            {isGoedeUpsell ? `1 tweeweken + ${dayCards} dag` : `${dayCards} dagkaarten`}
                          </div>
                        </div>
                        <div style={{ fontSize: 18, color: C.orange, fontWeight: 800 }}>→</div>
                        <div>
                          <div style={{ fontSize: 11, color: C.orangeDark, marginBottom: 3, fontWeight: 700 }}>{upgradeTier.label}</div>
                          <div style={{ fontSize: 17, fontWeight: 800, color: C.orangeDark }}>{formatEuro(upgradePrice)}</div>
                          <div style={{ fontSize: 10, color: C.orange }}>
                            {isGoedeUpsell ? "2 tweeweekenkaarten" : "1 tweeweekenkaart"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <Btn onClick={() => resetAndGo(isGoedeUpsell ? "beste_vriend" : "goede_vriend")} accent={upgradeTier.accent}>
                        {upgradeTier.emoji} Word {upgradeTier.label}
                      </Btn>
                      <Btn variant="secondary" onClick={() => setStep("confirm")}>
                        Nee bedankt, blijf bij {currentTier.label}
                      </Btn>
                    </div>
                  </div>
                );
              })()}
            </FadeIn>
          )}

          {/* CONFIRM */}
          {step === "confirm" && tier && (
            <FadeIn>
              <div style={{ textAlign: "center", marginBottom: 18 }}>
                <span style={{ fontSize: 38 }}>{tier.emoji}</span>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: C.dark, margin: "6px 0 0" }}>{tier.label}</h2>
              </div>

              <div style={{ background: C.grey100, borderRadius: 12, padding: "18px", marginBottom: 18 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: C.grey800, margin: "0 0 10px" }}>
                  Overzicht jaarlijkse donatie
                </h3>

                {(selectedTier === "goede_vriend" || selectedTier === "beste_vriend") && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: C.grey600, marginBottom: 5 }}>
                    <span>{twoWeekCards}× tweeweekenkaart</span>
                    <span style={{ fontWeight: 700 }}>{formatEuro(twoWeekCards * PRICE_TWOWEEK)}</span>
                  </div>
                )}

                {(selectedTier === "vriend" || dayCards > 0) && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: C.grey600, marginBottom: 5 }}>
                    <span>{dayCards}× dagkaart</span>
                    <span style={{ fontWeight: 700 }}>{formatEuro(dayCards * PRICE_DAY)}</span>
                  </div>
                )}

                <div
                  style={{
                    borderTop: `2px solid ${C.grey200}`,
                    marginTop: 10,
                    paddingTop: 10,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.grey800 }}>Totaal per jaar</span>
                  <span style={{ fontSize: 22, fontWeight: 800, color: C.orangeDark }}>{formatEuro(totalPrice())}</span>
                </div>
              </div>

              <Btn onClick={() => setStep("done")} accent={tier.accent}>
                Bevestig & ga naar betaling →
              </Btn>
              <div style={{ marginTop: 10, textAlign: "center" }}>
                <Btn variant="ghost" onClick={() => setStep("configure")}>← Wijzig selectie</Btn>
              </div>
            </FadeIn>
          )}

          {/* DONE */}
          {step === "done" && (
            <FadeIn>
              <div style={{ textAlign: "center", padding: "28px 0" }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: C.orange,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    fontSize: 28,
                    color: C.white,
                  }}
                >
                  ✓
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: C.dark, margin: "0 0 6px" }}>Bedankt!</h2>
                <p style={{ fontSize: 14, color: C.grey600, lineHeight: 1.6, margin: "0 0 20px" }}>
                  U wordt doorgestuurd naar Stripe om uw betaling van{" "}
                  <strong>{formatEuro(totalPrice())}</strong> af te ronden.
                </p>
                <div
                  style={{
                    background: C.grey100,
                    borderRadius: 10,
                    padding: "14px 18px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      border: `2px solid ${C.orange}`,
                      borderTopColor: "transparent",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  <span style={{ fontSize: 13, color: C.grey400 }}>Doorsturen naar Stripe…</span>
                </div>
                <br />
                <Btn
                  variant="ghost"
                  onClick={() => {
                    setStep("type");
                    setSelectedTier(null);
                    setDayCards(1);
                    setTwoWeekCards(1);
                  }}
                >
                  ← Opnieuw beginnen (demo)
                </Btn>
              </div>
            </FadeIn>
          )}
        </div>

        {/* POPUP: Beste Vriend at 10 day cards */}
        {showBestePopup && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(26,26,26,0.55)",
              backdropFilter: "blur(3px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
              padding: 20,
              animation: "fadeIn 0.2s ease",
            }}
          >
            <div
              style={{
                background: C.white,
                borderRadius: 16,
                padding: "26px 22px",
                maxWidth: 360,
                width: "100%",
                boxShadow: "0 16px 48px rgba(0,0,0,0.18)",
                animation: "slideUp 0.3s ease 0.05s both",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 38, marginBottom: 10 }}>🌟</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: C.dark, margin: "0 0 8px" }}>
                Word Beste Vriend!
              </h3>
              <p style={{ fontSize: 13, color: C.grey600, lineHeight: 1.6, margin: "0 0 4px" }}>
                U heeft het maximale aantal dagkaarten bereikt als Goede Vriend.
              </p>
              <p style={{ fontSize: 13, color: C.grey600, lineHeight: 1.6, margin: "0 0 18px" }}>
                Als <strong>Beste Vriend</strong> krijgt u <strong>twee tweeweekenkaarten</strong> vanaf{" "}
                <strong style={{ color: C.orangeDark }}>{formatEuro(PRICE_BESTE)}</strong> — en kunt u ook extra dagkaarten toevoegen!
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Btn
                  accent={C.orangeDeep}
                  onClick={() => { setShowBestePopup(false); resetAndGo("beste_vriend"); }}
                >
                  🌟 Word Beste Vriend
                </Btn>
                <Btn variant="secondary" onClick={() => setShowBestePopup(false)}>
                  Nee bedankt, blijf bij Goede Vriend
                </Btn>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}