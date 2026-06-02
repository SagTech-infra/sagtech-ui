import { Container, PageHeader } from '@sagtech-infra/ui';
import { Example } from '@/components/Example';
import { PropsTable } from '@/components/PropsTable';
import { ButtonBasicDemo } from '@/demos/Button/basic';

export default function ButtonPage() {
  return (
    <Container size="lg" as="main" className="py-48px">
      <PageHeader
        eyebrow="Form Controls"
        title="Button"
        subtitle="Primary action trigger with variants, sizes, icon-only and loading states."
      />

      <section className="mt-32px">
        <h2 className="font-orbitron text-28 mb-16px">Example</h2>
        <Example path="Button/basic" preview={<ButtonBasicDemo />} />
      </section>

      <section className="mt-48px">
        <h2 className="font-orbitron text-28 mb-16px">Props</h2>
        <PropsTable name="Button" />
      </section>
    </Container>
  );
}
