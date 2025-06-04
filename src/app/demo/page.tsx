import Editor from "@/components/editor/Editor";
import { demoData } from "@/data/demoData";

export default async function DemoPage() {
  console.log("fetched demo data, length:", demoData.length);
  return <Editor activities={demoData} />;
}
