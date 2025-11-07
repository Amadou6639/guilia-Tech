import React from "react";
import { useTranslation } from "react-i18next";

const Placeholder = ({ title }) => {
  const { t } = useTranslation();
  return (
    <div className="text-center py-16 bg-gray-100 rounded-lg">
      <h3 className="text-2xl font-semibold text-gray-700">
        {t("section")}: {title}
      </h3>
      <p className="text-gray-500 mt-2">{t("feature_in_development")}</p>
    </div>
  );
};

export default Placeholder;
