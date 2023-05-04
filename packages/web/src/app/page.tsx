export default function Home() {
  return (
    <div className="flex flex-col justify-center gap-8">
      <input
        type="url"
        className="p-4 border rounded-md"
        placeholder="Your URL here"
      />
    </div>
  );
}
