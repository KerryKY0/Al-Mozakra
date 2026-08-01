import React, { useState } from "react";
import { X, FileText, ShieldCheck } from "lucide-react";
import { useI18n } from "../services/i18n";

const TermsAndPrivacy: React.FC = () => {
  const [activeModal, setActiveModal] = useState<"terms" | "privacy" | null>(
    null,
  );
  const { t, dir } = useI18n();

  return (
    <>
      {/* Links at the bottom right */}
      <div
        className={`absolute bottom-4 ${dir === "rtl" ? "right-4 md:right-6 items-end" : "left-4 md:left-6 items-start"} md:bottom-6 z-20 flex flex-col md:flex-row gap-2 md:gap-4 md:items-center text-xs md:text-sm`}
      >
        <button
          onClick={() => setActiveModal("terms")}
          className="flex items-center gap-1.5 text-slate-400 hover:text-space-accent transition-colors bg-space-800/50 md:bg-transparent px-3 py-1.5 md:p-0 rounded-full md:rounded-none backdrop-blur-sm md:backdrop-blur-none border border-space-700/50 md:border-none"
        >
          <FileText size={14} />
          <span>{t("termsOfUse")}</span>
        </button>
        <button
          onClick={() => setActiveModal("privacy")}
          className="flex items-center gap-1.5 text-slate-400 hover:text-space-accent transition-colors bg-space-800/50 md:bg-transparent px-3 py-1.5 md:p-0 rounded-full md:rounded-none backdrop-blur-sm md:backdrop-blur-none border border-space-700/50 md:border-none"
        >
          <ShieldCheck size={14} />
          <span>{t("privacyPolicy")}</span>
        </button>
      </div>

      {/* Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-space-900 border border-space-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-space-800 bg-space-800/30">
              <h2 className="text-xl md:text-2xl font-bold text-main flex items-center gap-2">
                {activeModal === "terms" ? (
                  <>
                    <FileText className="text-space-accent" /> {t("termsOfUse")}
                  </>
                ) : (
                  <>
                    <ShieldCheck className="text-space-accent" />{" "}
                    {t("privacyPolicy")}
                  </>
                )}
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div
              className={`p-4 md:p-6 overflow-y-auto text-slate-300 text-sm md:text-base leading-relaxed space-y-4 ${dir === "rtl" ? "text-right" : "text-left"}`}
            >
              {activeModal === "terms" ? (
                <>
                  <p>{t("termsIntro")}</p>

                  <h3 className="text-lg font-semibold text-white mt-4">
                    1. {t("intellectualProperty")}
                  </h3>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: t("intellectualPropertyDesc")
                        .replace("كريم شاكر", "<strong>كريم شاكر</strong>")
                        .replace(
                          "Kareem Shaker",
                          "<strong>Kareem Shaker</strong>",
                        ),
                    }}
                  ></p>

                  <h3 className="text-lg font-semibold text-white mt-4">
                    2. {t("aiUse")}
                  </h3>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: t("aiUseDesc").replace(
                        "Gemini",
                        "<strong>Gemini</strong>",
                      ),
                    }}
                  ></p>

                  <h3 className="text-lg font-semibold text-white mt-4">
                    3. {t("generalConduct")}
                  </h3>
                  <p>{t("generalConductDesc")}</p>

                  <h3 className="text-lg font-semibold text-white mt-4">
                    4. {t("modifications")}
                  </h3>
                  <p>{t("modificationsDesc")}</p>
                </>
              ) : (
                <>
                  <p>{t("privacyIntro")}</p>

                  <h3 className="text-lg font-semibold text-white mt-4">
                    1. {t("dataCollection")}
                  </h3>
                  <p>{t("dataCollectionDesc")}</p>

                  <h3 className="text-lg font-semibold text-white mt-4">
                    2. {t("activityLogPolicy")}
                  </h3>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: t("activityLogDesc")
                        .replace(
                          "يتم تسجيل وتتبع كافة نشاطات الطالب داخل المنصة.",
                          "<strong>يتم تسجيل وتتبع كافة نشاطات الطالب داخل المنصة.</strong>",
                        )
                        .replace(
                          "all student activities within the platform are recorded and tracked.",
                          "<strong>all student activities within the platform are recorded and tracked.</strong>",
                        ),
                    }}
                  ></p>
                  <ul
                    className={`list-disc list-inside space-y-1 text-slate-400 ${dir === "rtl" ? "pr-4" : "pl-4"}`}
                  >
                    <li>{t("activity1")}</li>
                    <li>{t("activity2")}</li>
                    <li>{t("activity3")}</li>
                    <li>{t("activity4")}</li>
                    <li>{t("activity5")}</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-white mt-4">
                    3. {t("dataUse")}
                  </h3>
                  <p>{t("dataUseDesc")}</p>
                  <ul
                    className={`list-disc list-inside space-y-1 text-slate-400 ${dir === "rtl" ? "pr-4" : "pl-4"}`}
                  >
                    <li>{t("dataUse1")}</li>
                    <li>{t("dataUse2")}</li>
                    <li>{t("dataUse3")}</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-white mt-4">
                    4. {t("dataProtection")}
                  </h3>
                  <p>{t("dataProtectionDesc")}</p>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-space-800 bg-space-800/30 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-6 py-2 bg-space-700 text-white rounded-lg hover:bg-space-600 transition-colors font-medium"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TermsAndPrivacy;
