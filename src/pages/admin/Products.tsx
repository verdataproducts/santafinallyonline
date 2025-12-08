import { useState, useEffect, useRef } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2, ExternalLink, Upload, X, Image, Video } from 'lucide-react';
import { getProducts, ShopifyProduct } from '@/lib/shopify';
import { supabase } from '@/integrations/supabase/client';

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  productType: string;
  vendor: string;
  tags: string;
}

interface ProductImage {
  id: number;
  src: string;
  alt: string;
  position: number;
}

const initialFormData: ProductFormData = {
  title: '',
  description: '',
  price: '',
  productType: '',
  vendor: "Santa's Workshop",
  tags: '',
};

export default function AdminProducts() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ShopifyProduct | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts(100);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async () => {
    if (!formData.title || !formData.price) {
      toast({
        title: 'Validation Error',
        description: 'Title and price are required',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('shopify-admin', {
        body: {
          action: 'create_product',
          data: {
            title: formData.title,
            body_html: formData.description,
            product_type: formData.productType,
            vendor: formData.vendor,
            tags: formData.tags,
            variants: [{ price: formData.price }],
          },
        },
      });

      if (error) throw error;

      // Upload pending images if any
      if (pendingImages.length > 0 && data?.product?.id) {
        for (const file of pendingImages) {
          await uploadImageToProduct(data.product.id, file);
        }
      }

      toast({
        title: 'Success',
        description: 'Product created successfully',
      });
      setIsCreateOpen(false);
      setFormData(initialFormData);
      setPendingImages([]);
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to create product. Make sure the Shopify admin function is set up.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct || !formData.title) {
      toast({
        title: 'Validation Error',
        description: 'Title is required',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const productId = selectedProduct.node.id.replace('gid://shopify/Product/', '');
      
      const { data, error } = await supabase.functions.invoke('shopify-admin', {
        body: {
          action: 'update_product',
          data: {
            id: productId,
            title: formData.title,
            body_html: formData.description,
            product_type: formData.productType,
            vendor: formData.vendor,
            tags: formData.tags,
          },
        },
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
      setIsEditOpen(false);
      setSelectedProduct(null);
      setFormData(initialFormData);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    setIsSubmitting(true);
    try {
      const productId = selectedProduct.node.id.replace('gid://shopify/Product/', '');
      
      const { data, error } = await supabase.functions.invoke('shopify-admin', {
        body: {
          action: 'delete_product',
          data: { id: productId },
        },
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
      setIsDeleteOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchProductImages = async (productId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('shopify-admin', {
        body: {
          action: 'get_product_images',
          data: { product_id: productId },
        },
      });

      if (error) throw error;
      setProductImages(data?.images || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      setProductImages([]);
    }
  };

  const uploadImageToProduct = async (productId: string, file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = (reader.result as string).split(',')[1];
          
          const { error } = await supabase.functions.invoke('shopify-admin', {
            body: {
              action: 'upload_image',
              data: {
                product_id: productId,
                attachment: base64,
                alt: file.name,
              },
            },
          });

          if (error) throw error;
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // If in create mode (no selected product), add to pending
    if (!selectedProduct) {
      setPendingImages(prev => [...prev, ...Array.from(files)]);
      return;
    }

    const productId = selectedProduct.node.id.replace('gid://shopify/Product/', '');
    setUploadingImage(true);

    try {
      for (const file of Array.from(files)) {
        await uploadImageToProduct(productId, file);
      }

      toast({
        title: 'Success',
        description: `${files.length} image(s) uploaded successfully`,
      });
      
      await fetchProductImages(productId);
      fetchProducts();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!selectedProduct) return;

    const productId = selectedProduct.node.id.replace('gid://shopify/Product/', '');
    
    try {
      const { error } = await supabase.functions.invoke('shopify-admin', {
        body: {
          action: 'delete_image',
          data: {
            product_id: productId,
            image_id: imageId,
          },
        },
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Image deleted successfully',
      });
      
      await fetchProductImages(productId);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete image',
        variant: 'destructive',
      });
    }
  };

  const handleSaveVideoUrl = async () => {
    if (!selectedProduct) return;

    const productId = selectedProduct.node.id.replace('gid://shopify/Product/', '');
    
    try {
      const { error } = await supabase.functions.invoke('shopify-admin', {
        body: {
          action: 'update_product_metafields',
          data: {
            product_id: productId,
            namespace: 'custom',
            key: 'video_url',
            value: videoUrl,
            type: 'url',
          },
        },
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Video URL saved successfully',
      });
    } catch (error) {
      console.error('Error saving video URL:', error);
      toast({
        title: 'Error',
        description: 'Failed to save video URL',
        variant: 'destructive',
      });
    }
  };

  const removePendingImage = (index: number) => {
    setPendingImages(prev => prev.filter((_, i) => i !== index));
  };

  const openEditDialog = (product: ShopifyProduct) => {
    setSelectedProduct(product);
    setFormData({
      title: product.node.title,
      description: product.node.description,
      price: product.node.priceRange.minVariantPrice.amount,
      productType: '',
      vendor: '',
      tags: '',
    });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (product: ShopifyProduct) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const openMediaDialog = async (product: ShopifyProduct) => {
    setSelectedProduct(product);
    const productId = product.node.id.replace('gid://shopify/Product/', '');
    await fetchProductImages(productId);
    setVideoUrl('');
    setIsMediaOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Products</h1>
            <p className="text-muted-foreground">Manage your Shopify products</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={(open) => {
            setIsCreateOpen(open);
            if (!open) {
              setFormData(initialFormData);
              setPendingImages([]);
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>Create a new product in your Shopify store</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Product name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (KES) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Product description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productType">Product Type</Label>
                    <Input
                      id="productType"
                      value={formData.productType}
                      onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                      placeholder="e.g., Toys, Games"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="christmas, toys, kids"
                    />
                  </div>
                </div>
                
                {/* Pending Images Section */}
                <div className="space-y-2">
                  <Label>Product Images</Label>
                  <div className="border-2 border-dashed rounded-lg p-4">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          setPendingImages(prev => [...prev, ...Array.from(e.target.files!)]);
                        }
                      }}
                      className="hidden"
                      id="create-image-upload"
                    />
                    <label
                      htmlFor="create-image-upload"
                      className="flex flex-col items-center justify-center cursor-pointer py-4"
                    >
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Click to upload images</span>
                    </label>
                  </div>
                  
                  {pendingImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {pendingImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-20 object-cover rounded"
                          />
                          <button
                            onClick={() => removePendingImage(index)}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProduct} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Product'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Products</CardTitle>
            <CardDescription>{products.length} products in your store</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No products found. Add your first product!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.node.id}>
                        <TableCell>
                          {product.node.images.edges[0]?.node.url ? (
                            <img
                              src={product.node.images.edges[0].node.url}
                              alt={product.node.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">No img</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {product.node.title}
                        </TableCell>
                        <TableCell>
                          {product.node.priceRange.minVariantPrice.currencyCode}{' '}
                          {parseFloat(product.node.priceRange.minVariantPrice.amount).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openMediaDialog(product)}
                              title="Manage Media"
                            >
                              <Image className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(product)}
                              title="Edit Product"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(product)}
                              title="Delete Product"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                            <a
                              href={`/product/${product.node.handle}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="ghost" size="icon" title="View Product">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </a>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>Update product details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-productType">Product Type</Label>
                <Input
                  id="edit-productType"
                  value={formData.productType}
                  onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                  placeholder="e.g., Toys, Games"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                <Input
                  id="edit-tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="christmas, toys, kids"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateProduct} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Media Management Dialog */}
        <Dialog open={isMediaOpen} onOpenChange={setIsMediaOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Manage Media</DialogTitle>
              <DialogDescription>
                Add or remove images and videos for "{selectedProduct?.node.title}"
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="images" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="images" className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Images
                </TabsTrigger>
                <TabsTrigger value="videos" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Videos
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="images" className="space-y-4">
                {/* Upload Section */}
                <div className="border-2 border-dashed rounded-lg p-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center cursor-pointer py-4"
                  >
                    {uploadingImage ? (
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    ) : (
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    )}
                    <span className="mt-2 text-sm text-muted-foreground">
                      {uploadingImage ? 'Uploading...' : 'Click to upload images'}
                    </span>
                  </label>
                </div>

                {/* Current Images Grid */}
                {productImages.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4">
                    {productImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.src}
                          alt={image.alt || 'Product image'}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <span className="absolute bottom-2 left-2 bg-background/80 text-xs px-2 py-1 rounded">
                          Position: {image.position}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No images uploaded yet
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="videos" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="video-url">Video URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="video-url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... or video URL"
                      className="flex-1"
                    />
                    <Button onClick={handleSaveVideoUrl} disabled={!videoUrl}>
                      Save
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Paste a YouTube URL or direct video link. This will be saved as product metadata.
                  </p>
                </div>
                
                {videoUrl && (
                  <div className="rounded-lg overflow-hidden bg-muted aspect-video flex items-center justify-center">
                    {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop()}`}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <video src={videoUrl} controls className="w-full h-full" />
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsMediaOpen(false)}>
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedProduct?.node.title}"? This action cannot be undone and will remove the product from your Shopify store.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteProduct} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Product'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}