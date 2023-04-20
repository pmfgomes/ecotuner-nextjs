import ReduxProvider from "@/components/client/ReduxProvider/ReduxProvider";
import type { ILangPageParams } from "./langTypes";

interface IRootLayoutProps {
  children: React.ReactNode;
  params: ILangPageParams;
}

export default async function RootLayout(props: IRootLayoutProps) {
  const { children, params } = props;

  return (
    <html lang={params.lang}>
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
