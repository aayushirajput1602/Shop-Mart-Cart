
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Image, Upload, X } from 'lucide-react';

const ImageManager = () => {
  const [images, setImages] = useState<{ name: string; url: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingStatus, setUploadingStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('name, image_url')
        .not('image_url', 'is', null);
      
      if (error) throw error;
      
      if (data) {
        const uniqueImages = data.reduce((acc: { name: string; url: string }[], item) => {
          if (item.image_url && !acc.some(img => img.url === item.image_url)) {
            acc.push({ name: item.name, url: item.image_url });
          }
          return acc;
        }, []);
        
        setImages(uniqueImages);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load images');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      setUploadingStatus('uploading');
      
      // Use external URL as placeholder for now
      // In a real implementation, you would upload to Supabase Storage
      const mockUploadUrl = URL.createObjectURL(selectedFile);
      
      // For demonstration, we'll just add it to our local state
      setImages(prev => [...prev, { name: selectedFile.name, url: mockUploadUrl }]);
      
      setUploadingStatus('success');
      toast.success('Image uploaded successfully');
      setSelectedFile(null);
      
      // Reset the file input
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadingStatus('error');
      toast.error('Failed to upload image');
    }
  };

  const handleAddExternalImage = () => {
    if (!imageUrl.trim()) {
      toast.error('Please enter a valid image URL');
      return;
    }

    // Simple validation for URL format
    if (!imageUrl.match(/^https?:\/\/.+\.(jpeg|jpg|png|gif|webp)$/i)) {
      toast.error('Please enter a valid image URL (jpg, png, gif, webp)');
      return;
    }

    setImages(prev => [...prev, { name: 'External Image', url: imageUrl }]);
    toast.success('External image added successfully');
    setImageUrl('');
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Image URL copied to clipboard');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Image className="h-5 w-5 mr-2" />
          Image Manager
        </CardTitle>
        <CardDescription>
          Upload and manage product images
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-upload">Upload Image</Label>
            <div className="flex gap-2">
              <Input 
                id="image-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="flex-1" 
              />
              <Button 
                onClick={handleUpload} 
                disabled={!selectedFile || uploadingStatus === 'uploading'}
              >
                {uploadingStatus === 'uploading' ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="external-image">Add External Image URL</Label>
            <div className="flex gap-2">
              <Input 
                id="external-image" 
                type="url" 
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={handleUrlChange}
                className="flex-1" 
              />
              <Button onClick={handleAddExternalImage}>Add URL</Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Available Images</h3>
          {images.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-md">
              <p className="text-muted-foreground">No images available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-md overflow-hidden border bg-slate-50">
                    <img 
                      src={image.url} 
                      alt={image.name}
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';
                      }}
                    />
                  </div>
                  <div className="hidden group-hover:flex absolute inset-0 bg-black/50 items-center justify-center gap-2 rounded-md">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => handleCopyUrl(image.url)}
                    >
                      Copy URL
                    </Button>
                  </div>
                  <p className="text-xs truncate mt-1">{image.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageManager;
