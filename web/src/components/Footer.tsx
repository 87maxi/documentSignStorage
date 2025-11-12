export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-6 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          © {new Date().getFullYear()} DocVerify. All rights reserved.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Verify document signatures on the blockchain
        </p>
      </div>
    </footer>
  );
}