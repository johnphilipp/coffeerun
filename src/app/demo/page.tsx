import Editor from "@/components/editor/Editor";
import { demoData } from "@/data/demoData";

export default async function DemoPage() {
  return <Editor activities={demoData} />;
}
