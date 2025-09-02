import React, { useState } from 'react';
import Layout from '@/components/Layout';
import AdminRoute from '@/components/AdminRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Calendar, MapPin, Package, Home, Truck, User, Mail, Phone, BarChart3, Users, Settings, Shield, CheckCircle, XCircle, Edit, Trash2, Eye, Search } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dashboard Analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["admin_analytics"],
    queryFn: async () => {
      const [bookingsRes, purchasesRes, quotesRes, propertiesRes, usersRes] = await Promise.all([
        supabase.from("bookings").select("id, status, created_at"),
        supabase.from("purchases").select("id, status, created_at"),
        supabase.from("mover_quotes").select("id, status, created_at"),
        supabase.from("properties").select("id, type, created_at"),
        supabase.from("profiles").select("id, role, created_at")
      ]);

      return {
        totalBookings: bookingsRes.data?.length || 0,
        totalPurchases: purchasesRes.data?.length || 0,
        totalQuotes: quotesRes.data?.length || 0,
        totalProperties: propertiesRes.data?.length || 0,
        totalUsers: usersRes.data?.length || 0,
        recentBookings: bookingsRes.data?.filter(b => new Date(b.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length || 0,
        recentPurchases: purchasesRes.data?.filter(p => new Date(p.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length || 0,
        recentQuotes: quotesRes.data?.filter(q => new Date(q.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length || 0,
      };
    },
  });

  // Users Management
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin_users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Properties Management
  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ["admin_properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Bookings Management
  const { data: bookings, isLoading: bookingsLoading, error: bookingsError } = useQuery({
    queryKey: ["admin_bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          properties(title, image, type, location, price, price_type)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Marketplace Management
  const { data: marketplaceItems, isLoading: marketplaceLoading } = useQuery({
    queryKey: ["admin_marketplace"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketplace_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Purchases Management
  const { data: purchases, isLoading: purchasesLoading, error: purchasesError } = useQuery({
    queryKey: ["admin_purchases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchases")
        .select(`
          *,
          marketplace_items(title, image, category)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Moving Quotes Management
  const { data: quotes, isLoading: quotesLoading, error: quotesError } = useQuery({
    queryKey: ["admin_quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mover_quotes")
        .select(`
          *,
          moving_services(name, image, location, price_range)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Moving Services Management
  const { data: movingServices, isLoading: movingServicesLoading } = useQuery({
    queryKey: ["admin_moving_services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("moving_services")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Mutations
  const updateBookingStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_bookings"] });
      toast({ title: "Success", description: "Booking status updated successfully" });
    },
  });

  const updateUserRole = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: 'admin' | 'moderator' | 'user' }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ role })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_users"] });
      toast({ title: "Success", description: "User role updated successfully" });
    },
  });

  const updatePropertyStatus = useMutation({
    mutationFn: async ({ id, featured, verified }: { id: string; featured?: boolean; verified?: boolean }) => {
      const { error } = await supabase
        .from("properties")
        .update({ featured, verified })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_properties"] });
      toast({ title: "Success", description: "Property updated successfully" });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
      case 'completed':
      case 'quoted':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'moderator':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminRoute>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive platform management and analytics</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="properties" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Properties
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="marketplace" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Marketplace
              </TabsTrigger>
              <TabsTrigger value="movers" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Movers
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Overview */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics?.totalUsers || 0}</div>
                    <p className="text-xs text-muted-foreground">Registered users</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                    <Home className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics?.totalProperties || 0}</div>
                    <p className="text-xs text-muted-foreground">Listed properties</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics?.totalBookings || 0}</div>
                    <p className="text-xs text-muted-foreground">+{analytics?.recentBookings || 0} this week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">KSh 0</div>
                    <p className="text-xs text-muted-foreground">From all services</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest platform activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New user registered</p>
                          <p className="text-xs text-muted-foreground">2 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Property booking confirmed</p>
                          <p className="text-xs text-muted-foreground">15 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Moving quote requested</p>
                          <p className="text-xs text-muted-foreground">1 hour ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common administrative tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="mr-2 h-4 w-4" />
                      Manage Users
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Home className="mr-2 h-4 w-4" />
                      Review Properties
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Package className="mr-2 h-4 w-4" />
                      Moderate Marketplace
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Settings className="mr-2 h-4 w-4" />
                      System Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Users Management */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        User Management
                      </CardTitle>
                      <CardDescription>Manage user accounts and permissions</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                      />
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <LoadingSpinner />
                  ) : users && users.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users
                          .filter(user =>
                            user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <User className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{user.full_name || user.username}</p>
                                    <p className="text-sm text-muted-foreground">ID: {user.id.slice(0, 8)}...</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getRoleColor(user.role)}>
                                  {user.role}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={user.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                  {user.is_verified ? 'Verified' : 'Unverified'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {format(new Date(user.created_at), 'MMM dd, yyyy')}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Select
                                    value={user.role}
                                    onValueChange={(value) =>
                                      updateUserRole.mutate({ id: user.id, role: value as 'admin' | 'moderator' | 'user' })
                                    }
                                  >
                                    <SelectTrigger className="w-32">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="user">User</SelectItem>
                                      <SelectItem value="moderator">Moderator</SelectItem>
                                      <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No users found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Properties Management */}
            <TabsContent value="properties" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Property Management
                  </CardTitle>
                  <CardDescription>Review and manage property listings</CardDescription>
                </CardHeader>
                <CardContent>
                  {propertiesLoading ? (
                    <LoadingSpinner />
                  ) : properties && properties.length > 0 ? (
                    <div className="space-y-4">
                      {properties.map((property) => (
                        <Card key={property.id} className="border-l-4 border-l-primary">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-4 flex-1">
                                {property.image && (
                                  <img
                                    src={property.image}
                                    alt={property.title}
                                    className="w-20 h-20 rounded-lg object-cover"
                                  />
                                )}
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">{property.title}</h3>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-4 w-4" />
                                      {property.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Home className="h-4 w-4" />
                                      {property.type}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg font-bold text-primary">
                                      KSh {property.price.toLocaleString()}
                                    </span>
                                    <span className="text-sm text-muted-foreground">per {property.price_type}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge className={property.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                      {property.featured ? 'Featured' : 'Regular'}
                                    </Badge>
                                    <Badge className={property.landlord_verified || property.agency_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                      {property.landlord_verified || property.agency_verified ? 'Verified' : 'Unverified'}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updatePropertyStatus.mutate({
                                    id: property.id,
                                    featured: !property.featured
                                  })}
                                >
                                  {property.featured ? <XCircle className="h-4 w-4 mr-1" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                                  {property.featured ? 'Unfeature' : 'Feature'}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updatePropertyStatus.mutate({
                                    id: property.id,
                                    verified: !(property.landlord_verified || property.agency_verified)
                                  })}
                                >
                                  <Shield className="h-4 w-4 mr-1" />
                                  {property.landlord_verified || property.agency_verified ? 'Unverify' : 'Verify'}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No properties found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bookings Management */}
            <TabsContent value="bookings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Booking Management
                  </CardTitle>
                  <CardDescription>Manage property bookings and reservations</CardDescription>
                </CardHeader>
                <CardContent>
                  {bookingsLoading ? (
                    <LoadingSpinner />
                  ) : bookingsError ? (
                    <ErrorMessage />
                  ) : bookings && bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <Card key={booking.id} className="border-l-4 border-l-primary">
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-start gap-4">
                                {booking.properties?.image && (
                                  <img
                                    src={booking.properties.image}
                                    alt={booking.properties.title}
                                    className="w-16 h-16 rounded-lg object-cover"
                                  />
                                )}
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">
                                    {booking.properties?.title || 'Property'}
                                  </h3>
                                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                    <MapPin className="h-4 w-4" />
                                    {booking.properties?.location}
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                    <Calendar className="h-4 w-4" />
                                    {format(new Date(booking.booking_date), 'PPP')}
                                  </div>
                                  <div className="text-sm space-y-1">
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      {booking.guest_name}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-4 w-4" />
                                      {booking.guest_email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4" />
                                      {booking.guest_phone}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Select
                                  value={booking.status}
                                  onValueChange={(value) => updateBookingStatus.mutate({ id: booking.id, status: value })}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                  </SelectContent>
                                </Select>
                                <div className="text-sm text-muted-foreground">
                                  {format(new Date(booking.created_at), 'MMM dd, yyyy')}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No bookings yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Marketplace Management */}
            <TabsContent value="marketplace" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Marketplace Management
                  </CardTitle>
                  <CardDescription>Manage marketplace items and purchases</CardDescription>
                </CardHeader>
                <CardContent>
                  {marketplaceLoading ? (
                    <LoadingSpinner />
                  ) : marketplaceItems && marketplaceItems.length > 0 ? (
                    <div className="space-y-4">
                      {marketplaceItems.map((item) => (
                        <Card key={item.id} className="border-l-4 border-l-secondary">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-4 flex-1">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-16 h-16 rounded-lg object-cover"
                                  />
                                )}
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">{item.title}</h3>
                                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                    <Package className="h-4 w-4" />
                                    {item.category}
                                  </div>
                                  <div className="text-lg font-bold text-primary mb-2">
                                    KSh {item.price.toLocaleString()}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge className="bg-blue-100 text-blue-800">
                                      {item.condition}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                      ID: {item.created_by?.slice(0, 8) || 'Unknown'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No marketplace items found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Moving Services Management */}
            <TabsContent value="movers" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Moving Services Management
                  </CardTitle>
                  <CardDescription>Manage moving services and quotes</CardDescription>
                </CardHeader>
                <CardContent>
                  {movingServicesLoading ? (
                    <LoadingSpinner />
                  ) : movingServices && movingServices.length > 0 ? (
                    <div className="space-y-4">
                      {movingServices.map((service) => (
                        <Card key={service.id} className="border-l-4 border-l-accent">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-4 flex-1">
                                {service.image && (
                                  <img
                                    src={service.image}
                                    alt={service.name}
                                    className="w-16 h-16 rounded-lg object-cover"
                                  />
                                )}
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">{service.name}</h3>
                                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                    <MapPin className="h-4 w-4" />
                                    {service.location}
                                  </div>
                                  <div className="text-sm text-muted-foreground mb-2">
                                    {service.price_range}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge className={service.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                      {service.verified ? 'Verified' : 'Unverified'}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                      ID: {service.created_by?.slice(0, 8) || 'Unknown'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No moving services found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </AdminRoute>
  );
};

export default Admin;
