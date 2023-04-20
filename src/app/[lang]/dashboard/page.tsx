import { useTranslation } from "@/app/i18n";
import { TLangProps } from "../langTypes";

export default async function DashboardPage({ params }: TLangProps) {
  const { lang } = params;

  // const { i18n } = await useTranslation(lang);

  return (
    <>
      <h1>Dashboard</h1>
      {/* <h2>{i18n.language}</h2> */}
    </>
  );
}
