import Header from "./components/header";
import Footer from "./components/footer";

export default function Home() {
  return (
      <div className="min-h-screen bg-gray-100">
        <Header />  
        <main className="container mx-auto py-6 px-4">
          Hi
        </main>
        <Footer/>
      </div>
  );
}
