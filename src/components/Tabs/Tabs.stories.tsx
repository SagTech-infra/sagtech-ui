import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Tabs from "./Tabs";
import TabsRoot from "./TabsRoot";
import TabsList from "./TabsList";
import TabsTrigger from "./TabsTrigger";
import TabsContent from "./TabsContent";

const meta = {
  title: "Data Display/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    defaultIndex: { control: "number" },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const panelCls = "text-grey_4 font-manrope text-14 leading-28 mt-24px";

export const Default: Story = {
  args: {
    items: [
      {
        label: "Overview",
        content: (
          <div className="text-grey_4 font-manrope text-14 leading-28 mt-24px">
            <p>
              This is the overview panel content. It provides a high-level
              summary of the project scope, timeline, and deliverables.
            </p>
          </div>
        ),
      },
      {
        label: "Details",
        content: (
          <div className="text-grey_4 font-manrope text-14 leading-28 mt-24px">
            <p>
              Detailed information about the implementation, including technical
              stack, architecture decisions, and integration points.
            </p>
          </div>
        ),
      },
    ],
  },
};

export const ThreeTabs: Story = {
  args: {
    items: [
      {
        label: "Web Development",
        content: (
          <div className="text-grey_4 font-manrope text-14 leading-28 mt-24px">
            <p>
              Modern web applications built with React, Next.js, and TypeScript
              for scalable, maintainable solutions.
            </p>
          </div>
        ),
      },
      {
        label: "Mobile",
        content: (
          <div className="text-grey_4 font-manrope text-14 leading-28 mt-24px">
            <p>
              Cross-platform mobile apps for iOS and Android using React Native
              and Flutter.
            </p>
          </div>
        ),
      },
      {
        label: "Cloud & DevOps",
        content: (
          <div className="text-grey_4 font-manrope text-14 leading-28 mt-24px">
            <p>
              Scalable cloud infrastructure with AWS, Docker, and Kubernetes for
              reliable deployments.
            </p>
          </div>
        ),
      },
    ],
  },
};

export const Interactive: Story = {
  args: {
    onChange: (index: number) => console.log("Tab changed to:", index),
    items: [
      {
        label: "First Tab",
        content: (
          <div className="text-grey_4 font-manrope text-14 leading-28 mt-24px">
            <p>
              Content for the first tab. Switch tabs and check the console for
              onChange events.
            </p>
          </div>
        ),
      },
      {
        label: "Second Tab",
        content: (
          <div className="text-grey_4 font-manrope text-14 leading-28 mt-24px">
            <p>
              Content for the second tab. The onChange callback fires on each
              switch.
            </p>
          </div>
        ),
      },
    ],
  },
};

export const CompoundAPI: StoryObj = {
  render: () => (
    <TabsRoot defaultValue="overview">
      <TabsList aria-label="Org sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className={panelCls}>
          <p>
            Compound API — uses Tabs.Root / Tabs.List / Tabs.Trigger /
            Tabs.Content. Try arrow keys.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="members">
        <div className={panelCls}>
          <p>Members panel content.</p>
        </div>
      </TabsContent>
      <TabsContent value="billing">
        <div className={panelCls}>
          <p>Billing panel content.</p>
        </div>
      </TabsContent>
    </TabsRoot>
  ),
};

export const Controlled: StoryObj = {
  render: () => {
    function ControlledExample() {
      const [tab, setTab] = useState("a");
      return (
        <div>
          <p className="text-grey_4 font-manrope text-12 mb-12px">
            Active value: <span className="text-pr_purple">{tab}</span>
          </p>
          <TabsRoot value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="a">A</TabsTrigger>
              <TabsTrigger value="b">B</TabsTrigger>
              <TabsTrigger value="c">C</TabsTrigger>
            </TabsList>
            <TabsContent value="a">
              <div className={panelCls}>Panel A</div>
            </TabsContent>
            <TabsContent value="b">
              <div className={panelCls}>Panel B</div>
            </TabsContent>
            <TabsContent value="c">
              <div className={panelCls}>Panel C</div>
            </TabsContent>
          </TabsRoot>
        </div>
      );
    }
    return <ControlledExample />;
  },
};

export const Vertical: StoryObj = {
  render: () => (
    <TabsRoot defaultValue="one" orientation="vertical">
      <TabsList aria-label="Settings sections" className="flex-col w-200px">
        <TabsTrigger value="one">General</TabsTrigger>
        <TabsTrigger value="two">Notifications</TabsTrigger>
        <TabsTrigger value="three">Security</TabsTrigger>
      </TabsList>
      <TabsContent value="one">
        <div className={panelCls}>
          General settings — ArrowUp/ArrowDown to navigate.
        </div>
      </TabsContent>
      <TabsContent value="two">
        <div className={panelCls}>Notifications settings.</div>
      </TabsContent>
      <TabsContent value="three">
        <div className={panelCls}>Security settings.</div>
      </TabsContent>
    </TabsRoot>
  ),
};

export const ManualActivation: StoryObj = {
  render: () => (
    <TabsRoot defaultValue="one" activationMode="manual">
      <TabsList aria-label="Manual">
        <TabsTrigger value="one">Tab 1</TabsTrigger>
        <TabsTrigger value="two">Tab 2</TabsTrigger>
        <TabsTrigger value="three">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="one">
        <div className={panelCls}>
          Arrow keys move focus only; press Enter or Space to activate the
          focused tab.
        </div>
      </TabsContent>
      <TabsContent value="two">
        <div className={panelCls}>Panel 2 — manually activated.</div>
      </TabsContent>
      <TabsContent value="three">
        <div className={panelCls}>Panel 3 — manually activated.</div>
      </TabsContent>
    </TabsRoot>
  ),
};

export const WithDisabledTab: StoryObj = {
  render: () => (
    <TabsRoot defaultValue="one">
      <TabsList aria-label="With disabled">
        <TabsTrigger value="one">Available</TabsTrigger>
        <TabsTrigger value="two" disabled>
          Disabled
        </TabsTrigger>
        <TabsTrigger value="three">Available</TabsTrigger>
      </TabsList>
      <TabsContent value="one">
        <div className={panelCls}>
          The middle tab is disabled. Arrow keys skip it during navigation.
        </div>
      </TabsContent>
      <TabsContent value="two">
        <div className={panelCls}>
          This panel is not reachable via arrow keys.
        </div>
      </TabsContent>
      <TabsContent value="three">
        <div className={panelCls}>You skipped right over the disabled tab.</div>
      </TabsContent>
    </TabsRoot>
  ),
};

export const LazyMountFalse: StoryObj = {
  render: () => (
    <TabsRoot defaultValue="one" lazyMount={false}>
      <TabsList aria-label="Eager mount">
        <TabsTrigger value="one">One</TabsTrigger>
        <TabsTrigger value="two">Two</TabsTrigger>
      </TabsList>
      <TabsContent value="one">
        <div className={panelCls}>
          All panels render in the DOM; inactive ones carry the{" "}
          <code>hidden</code> attribute.
        </div>
      </TabsContent>
      <TabsContent value="two">
        <div className={panelCls}>
          Always mounted, just hidden when inactive.
        </div>
      </TabsContent>
    </TabsRoot>
  ),
};
