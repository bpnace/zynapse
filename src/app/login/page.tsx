import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Anmelden | Zynapse",
  description: "Platzhalter für den späteren Zugang zu internen Nutzer- und Kreativ-Workflows.",
  path: "/login",
  indexable: false,
});

export default function LoginPage() {
  return (
    <section className="mx-auto text-center flex w-full max-w-4xl flex-col gap-6 px-6 pt-32 pb-16 sm:px-8">
      <h1 className="font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em]">
        Der Login wird erst mit der operativen Plattform freigeschaltet.
      </h1>
      <div className="p-8 ">
        Dashboards und operative Accounts sind bewusst noch nicht Teil der
        öffentlichen v1. Sobald die Plattform bereit ist, werden alle angemeldeten Interessenten direkt informiert und erhalten Zugang. Bei Fragen oder Interesse an einer frühen Demo kannst du dich jederzeit über den Kontakt melden.
      </div>
      <div className="flex justify-center gap-4">
      </div>
    </section>
  );
}
