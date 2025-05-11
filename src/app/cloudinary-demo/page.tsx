import CloudinaryImage from '@/components/ui/CloudinaryImage';
import dynamic from 'next/dynamic';

// Import the CloudinaryUploader component dynamically to avoid SSR issues
const CloudinaryUploader = dynamic(
  () => import('@/components/ui/CloudinaryUploader'),
  { ssr: false }
);

export default function CloudinaryDemoPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Cloudinary Image Demo</h1>
      
      {/* Image Uploader Section */}
      <section className="mb-16 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-6">Upload to Cloudinary</h2>
        <p className="mb-6 text-gray-600">
          Upload an image directly to Cloudinary. Once uploaded, the optimized URL will be available for use.
        </p>
        <CloudinaryUploader />
      </section>
      
      <h2 className="text-2xl font-semibold mb-6">Cloudinary Image Examples</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Sample Cloudinary image */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Sample Cloudinary Image</h2>
          <CloudinaryImage
            src="cld-sample-5" 
            alt="Sample Cloudinary Image"
            width={300}
            height={300}
            crop={{
              type: 'auto',
              source: true
            }}
            className="rounded-lg mx-auto"
          />
          <p className="mt-4 text-gray-600 text-center">Using Cloudinary sample image</p>
        </div>
        
        {/* Cloudinary image with fallback */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Invalid Image with Fallback</h2>
          <CloudinaryImage
            src="non-existent-image" 
            alt="Invalid Image"
            width={300}
            height={300}
            className="rounded-lg mx-auto"
          />
          <p className="mt-4 text-gray-600 text-center">Shows fallback when image doesn't exist</p>
        </div>
        
        {/* Default image replacement */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Default Image Replacement</h2>
          <CloudinaryImage
            src="fitnass-default" 
            alt="Default Image"
            width={300}
            height={300}
            className="rounded-lg mx-auto"
          />
          <p className="mt-4 text-gray-600 text-center">Automatically replaces default image</p>
        </div>
        
        {/* Custom crop */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Custom Crop: Circle</h2>
          <CloudinaryImage
            src="cld-sample-2" 
            alt="Circle Crop"
            width={300}
            height={300}
            crop={{ type: 'circle' }}
            className="mx-auto"
          />
          <p className="mt-4 text-gray-600 text-center">Using circular crop transformation</p>
        </div>
        
        {/* External image */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">External Image</h2>
          <CloudinaryImage
            src="https://via.placeholder.com/300" 
            alt="External Image"
            width={300}
            height={300}
            className="rounded-lg mx-auto"
          />
          <p className="mt-4 text-gray-600 text-center">Handles external images too</p>
        </div>
        
        {/* Custom fallback */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Custom Fallback</h2>
          <CloudinaryImage
            src="non-existent-image-2" 
            alt="Custom Fallback"
            width={300}
            height={300}
            fallbackSrc="/images/logo.svg"
            className="rounded-lg mx-auto"
          />
          <p className="mt-4 text-gray-600 text-center">Using custom fallback image</p>
        </div>
      </div>
      
      {/* Image transformations section */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">Cloudinary Transformations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Original</h3>
            <CloudinaryImage
              src="cld-sample" 
              alt="Original"
              width={200}
              height={200}
              className="mx-auto"
            />
          </div>
          
          <div className="border p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Grayscale</h3>
            <CloudinaryImage
              src="cld-sample/e_grayscale" 
              alt="Grayscale"
              width={200}
              height={200}
              className="mx-auto"
            />
          </div>
          
          <div className="border p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Sepia</h3>
            <CloudinaryImage
              src="cld-sample/e_sepia" 
              alt="Sepia"
              width={200}
              height={200}
              className="mx-auto"
            />
          </div>
          
          <div className="border p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Oil Paint</h3>
            <CloudinaryImage
              src="cld-sample/e_oil_paint" 
              alt="Oil Paint"
              width={200}
              height={200}
              className="mx-auto"
            />
          </div>
        </div>
      </section>
    </div>
  );
} 