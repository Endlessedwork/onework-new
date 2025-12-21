import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, Edit, Trash2, ArrowLeft, Upload, Image } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Product, InsertProduct } from "@shared/schema";
import { ObjectUploader } from "@/components/ObjectUploader";

export default function AdminProducts() {
  const [, setLocation] = useLocation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Partial<InsertProduct>>({
    name: "",
    nameEn: "",
    nameTh: "",
    collection: "",
    collectionEn: "",
    collectionTh: "",
    description: "",
    descriptionEn: "",
    descriptionTh: "",
    category: "",
    imageUrl: "",
    isActive: true,
    sortOrder: 0,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", { credentials: "include" });
      if (!response.ok) setLocation("/admin/login");
    } catch (error) {
      setLocation("/admin/login");
    }
  };

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/admin/products"],
    queryFn: async () => {
      const response = await fetch("/api/admin/products", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast.success("Product created successfully");
      setDialogOpen(false);
      resetForm();
    },
    onError: () => toast.error("Failed to create product"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertProduct> }) => {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast.success("Product updated successfully");
      setDialogOpen(false);
      resetForm();
    },
    onError: () => toast.error("Failed to update product"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast.success("Product deleted successfully");
    },
    onError: () => toast.error("Failed to delete product"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: formData });
    } else {
      createMutation.mutate(formData as InsertProduct);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      nameEn: "",
      nameTh: "",
      collection: "",
      collectionEn: "",
      collectionTh: "",
      description: "",
      descriptionEn: "",
      descriptionTh: "",
      category: "",
      imageUrl: "",
      isActive: true,
      sortOrder: 0,
    });
    setEditingProduct(null);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setLocation("/admin/login");
  };

  const handleGetUploadParameters = async () => {
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to get upload URL");
    const data = await response.json();
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = (result: { successful: Array<{ uploadURL?: string }> }) => {
    if (result.successful && result.successful.length > 0) {
      const uploadURL = result.successful[0].uploadURL;
      if (uploadURL) {
        const url = new URL(uploadURL);
        const objectPath = `/objects${url.pathname.split("/.private")[1] || url.pathname}`;
        setFormData({ ...formData, imageUrl: objectPath });
        toast.success("Image uploaded successfully!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <h1 className="text-xl font-heading font-bold text-primary">Product Management</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Products</h2>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-product">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                <DialogDescription>Fill in the product details below</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name (English)</Label>
                    <Input
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Name (Thai)</Label>
                    <Input
                      value={formData.nameTh}
                      onChange={(e) => setFormData({ ...formData, nameTh: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Name (Default)</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Collection (English)</Label>
                    <Input
                      value={formData.collectionEn}
                      onChange={(e) => setFormData({ ...formData, collectionEn: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Collection (Thai)</Label>
                    <Input
                      value={formData.collectionTh}
                      onChange={(e) => setFormData({ ...formData, collectionTh: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Collection (Default)</Label>
                  <Input
                    value={formData.collection}
                    onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description (English)</Label>
                  <Textarea
                    value={formData.descriptionEn || ""}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description (Thai)</Label>
                  <Textarea
                    value={formData.descriptionTh || ""}
                    onChange={(e) => setFormData({ ...formData, descriptionTh: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input
                      value={formData.category || ""}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sort Order</Label>
                    <Input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Product Image</Label>
                  <div className="flex items-center gap-4">
                    <ObjectUploader
                      maxNumberOfFiles={1}
                      maxFileSize={10485760}
                      onGetUploadParameters={handleGetUploadParameters}
                      onComplete={handleUploadComplete}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </ObjectUploader>
                    {formData.imageUrl && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Image className="w-4 h-4" />
                        <span className="truncate max-w-[200px]">{formData.imageUrl}</span>
                      </div>
                    )}
                  </div>
                  {formData.imageUrl && formData.imageUrl.startsWith("/objects/") && (
                    <div className="mt-2">
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label>Active (visible on website)</Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingProduct ? "Update Product" : "Create Product"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : products.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No products yet</p>
            <p className="text-sm text-muted-foreground">Click "Add Product" to create your first product</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                {product.imageUrl && (
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.collection}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  {product.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(product)}
                      data-testid={`button-edit-${product.id}`}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product.id)}
                      data-testid={`button-delete-${product.id}`}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
