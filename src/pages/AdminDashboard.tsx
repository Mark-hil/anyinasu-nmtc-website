import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Users, GraduationCap, Megaphone, Calendar, FileDown, CreditCard, Plus, Pencil, Trash2, Check, X, Eye, TrendingUp, UserCheck, Clock, UserCog, Image, Loader2, BookOpen, ClipboardList, FileCheck, BookOpenCheck } from "lucide-react";
import { format } from "date-fns";
import StudentsTab from "@/components/admin/StudentsTab";
import CoursesTab from "@/components/admin/CoursesTab";
import EnrollmentsTab from "@/components/admin/EnrollmentsTab";
import TranscriptsTab from "@/components/admin/TranscriptsTab";
import AcademicAdminTab from "@/components/admin/AcademicAdminTab";

// ─── Stats Overview ──────────────────────────────────────
const StatsOverview = () => {
  const [stats, setStats] = useState({
    applications: 0, pendingApps: 0,
    alumni: 0, pendingAlumni: 0,
    announcements: 0, events: 0,
    downloads: 0, payments: 0, pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [apps, alumni, ann, events, downloads, payments] = await Promise.all([
        supabase.from("admission_applications").select("status"),
        supabase.from("alumni").select("is_approved"),
        supabase.from("announcements").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("downloads").select("id", { count: "exact", head: true }),
        supabase.from("fee_payments").select("status"),
      ]);
      setStats({
        applications: apps.data?.length || 0,
        pendingApps: apps.data?.filter(a => a.status === "pending").length || 0,
        alumni: alumni.data?.length || 0,
        pendingAlumni: alumni.data?.filter(a => !a.is_approved).length || 0,
        announcements: ann.count || 0,
        events: events.count || 0,
        downloads: downloads.count || 0,
        payments: payments.data?.length || 0,
        pendingPayments: payments.data?.filter(p => p.status === "pending").length || 0,
      });
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return null;

  const cards = [
    { label: "Applications", value: stats.applications, sub: `${stats.pendingApps} pending`, icon: GraduationCap, color: "text-blue-600" },
    { label: "Alumni", value: stats.alumni, sub: `${stats.pendingAlumni} awaiting approval`, icon: Users, color: "text-green-600" },
    { label: "Announcements", value: stats.announcements, sub: "published", icon: Megaphone, color: "text-purple-600" },
    { label: "Events", value: stats.events, sub: "total", icon: Calendar, color: "text-orange-600" },
    { label: "Downloads", value: stats.downloads, sub: "documents", icon: FileDown, color: "text-teal-600" },
    { label: "Payments", value: stats.payments, sub: `${stats.pendingPayments} pending`, icon: CreditCard, color: "text-red-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {cards.map(c => (
        <Card key={c.label}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <c.icon className={`h-5 w-5 ${c.color}`} />
              <span className="text-2xl font-bold">{c.value}</span>
            </div>
            <p className="text-sm font-medium">{c.label}</p>
            <p className="text-xs text-muted-foreground">{c.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const AdminDashboard = () => {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/auth");
  }, [loading, isAdmin, navigate]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div className="section-padding bg-muted/30">
      <div className="container-max">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage all institutional content</p>
          </div>
        </div>

        <StatsOverview />

        <Tabs defaultValue="admissions" className="space-y-4">
          <TabsList className="flex flex-wrap h-auto gap-1">
            <TabsTrigger value="admissions" className="gap-1"><GraduationCap className="h-4 w-4" /> Admissions</TabsTrigger>
            <TabsTrigger value="alumni" className="gap-1"><Users className="h-4 w-4" /> Alumni</TabsTrigger>
            <TabsTrigger value="announcements" className="gap-1"><Megaphone className="h-4 w-4" /> Announcements</TabsTrigger>
            <TabsTrigger value="events" className="gap-1"><Calendar className="h-4 w-4" /> Events</TabsTrigger>
            <TabsTrigger value="downloads" className="gap-1"><FileDown className="h-4 w-4" /> Downloads</TabsTrigger>
            <TabsTrigger value="payments" className="gap-1"><CreditCard className="h-4 w-4" /> Payments</TabsTrigger>
            <TabsTrigger value="gallery" className="gap-1"><Image className="h-4 w-4" /> Gallery</TabsTrigger>
            <TabsTrigger value="students" className="gap-1"><GraduationCap className="h-4 w-4" /> Students</TabsTrigger>
            <TabsTrigger value="courses" className="gap-1"><BookOpen className="h-4 w-4" /> Courses</TabsTrigger>
            <TabsTrigger value="enrollments" className="gap-1"><ClipboardList className="h-4 w-4" /> Enrollments</TabsTrigger>
            <TabsTrigger value="transcripts" className="gap-1"><FileCheck className="h-4 w-4" /> Transcripts</TabsTrigger>
            <TabsTrigger value="academic" className="gap-1"><BookOpenCheck className="h-4 w-4" /> Academic Ops</TabsTrigger>
            <TabsTrigger value="users" className="gap-1"><UserCog className="h-4 w-4" /> Users</TabsTrigger>
          </TabsList>

          <TabsContent value="admissions"><AdmissionsTab /></TabsContent>
          <TabsContent value="alumni"><AlumniTab /></TabsContent>
          <TabsContent value="announcements"><AnnouncementsTab /></TabsContent>
          <TabsContent value="events"><EventsTab /></TabsContent>
          <TabsContent value="downloads"><DownloadsTab /></TabsContent>
          <TabsContent value="payments"><PaymentsTab /></TabsContent>
          <TabsContent value="gallery"><GalleryTab /></TabsContent>
          <TabsContent value="students"><StudentsTab /></TabsContent>
          <TabsContent value="courses"><CoursesTab /></TabsContent>
          <TabsContent value="enrollments"><EnrollmentsTab /></TabsContent>
          <TabsContent value="transcripts"><TranscriptsTab /></TabsContent>
          <TabsContent value="academic"><AcademicAdminTab /></TabsContent>
          <TabsContent value="users"><UsersTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// ─── Admissions Tab ──────────────────────────────────────
const AdmissionsTab = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchApps = async () => {
    const { data } = await supabase.from("admission_applications").select("*").order("submitted_at", { ascending: false });
    if (data) setApps(data);
    setLoading(false);
  };

  useEffect(() => { fetchApps(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("admission_applications").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: `Application ${status}` }); fetchApps(); }
  };

  const statusColor = (s: string) => s === "approved" ? "default" : s === "rejected" ? "destructive" : "secondary";

  return (
    <Card>
      <CardHeader><CardTitle>Admission Applications ({apps.length})</CardTitle></CardHeader>
      <CardContent>
        {loading ? <p className="text-muted-foreground">Loading...</p> : apps.length === 0 ? <p className="text-muted-foreground">No applications yet.</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apps.map(a => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.full_name}</TableCell>
                  <TableCell>{a.program}</TableCell>
                  <TableCell>{a.email}</TableCell>
                  <TableCell>{a.phone}</TableCell>
                  <TableCell><Badge variant={statusColor(a.status)}>{a.status}</Badge></TableCell>
                  <TableCell className="text-sm">{format(new Date(a.submitted_at), "MMM d, yyyy")}</TableCell>
                  <TableCell className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => updateStatus(a.id, "approved")} disabled={a.status === "approved"}><Check className="h-3 w-3" /></Button>
                    <Button size="sm" variant="outline" onClick={() => updateStatus(a.id, "rejected")} disabled={a.status === "rejected"}><X className="h-3 w-3" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

// ─── Alumni Tab ──────────────────────────────────────────
const AlumniTab = () => {
  const [alumni, setAlumni] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAlumni = async () => {
    const { data } = await supabase.from("alumni").select("*").order("created_at", { ascending: false });
    if (data) setAlumni(data);
    setLoading(false);
  };

  useEffect(() => { fetchAlumni(); }, []);

  const toggleApproval = async (id: string, current: boolean) => {
    const { error } = await supabase.from("alumni").update({ is_approved: !current }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: `Alumni ${!current ? "approved" : "unapproved"}` }); fetchAlumni(); }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Alumni Registrations ({alumni.length})</CardTitle></CardHeader>
      <CardContent>
        {loading ? <p className="text-muted-foreground">Loading...</p> : alumni.length === 0 ? <p className="text-muted-foreground">No alumni registered.</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alumni.map(a => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.full_name}</TableCell>
                  <TableCell>{a.program}</TableCell>
                  <TableCell>{a.graduation_year}</TableCell>
                  <TableCell>{a.email}</TableCell>
                  <TableCell><Badge variant={a.is_approved ? "default" : "secondary"}>{a.is_approved ? "Approved" : "Pending"}</Badge></TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => toggleApproval(a.id, a.is_approved)}>
                      {a.is_approved ? "Revoke" : "Approve"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

// ─── Announcements Tab ───────────────────────────────────
const AnnouncementsTab = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", content: "", excerpt: "", category: "general", is_featured: false, is_published: true });
  const { toast } = useToast();

  const fetchItems = async () => {
    const { data } = await supabase.from("announcements").select("*").order("published_at", { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { setEditing(null); setForm({ title: "", content: "", excerpt: "", category: "general", is_featured: false, is_published: true }); setDialogOpen(true); };
  const openEdit = (item: any) => { setEditing(item); setForm({ title: item.title, content: item.content || "", excerpt: item.excerpt || "", category: item.category || "general", is_featured: item.is_featured, is_published: item.is_published }); setDialogOpen(true); };

  const save = async () => {
    if (!form.title) { toast({ title: "Title is required", variant: "destructive" }); return; }
    const payload = { ...form };
    let error;
    if (editing) {
      ({ error } = await supabase.from("announcements").update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("announcements").insert(payload));
    }
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: editing ? "Updated" : "Created" }); setDialogOpen(false); fetchItems(); }
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); fetchItems(); }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Announcements ({items.length})</CardTitle>
        <Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-1" /> New</Button>
      </CardHeader>
      <CardContent>
        <AnnouncementDialog open={dialogOpen} onOpenChange={setDialogOpen} form={form} setForm={setForm} onSave={save} editing={!!editing} />
        {loading ? <p className="text-muted-foreground">Loading...</p> : items.length === 0 ? <p className="text-muted-foreground">No announcements.</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">{item.title}</TableCell>
                  <TableCell className="capitalize">{item.category}</TableCell>
                  <TableCell>{item.is_featured ? <Check className="h-4 w-4 text-primary" /> : <X className="h-4 w-4 text-muted-foreground" />}</TableCell>
                  <TableCell>{item.is_published ? <Badge>Live</Badge> : <Badge variant="secondary">Draft</Badge>}</TableCell>
                  <TableCell className="text-sm">{format(new Date(item.published_at), "MMM d, yyyy")}</TableCell>
                  <TableCell className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => openEdit(item)}><Pencil className="h-3 w-3" /></Button>
                    <Button size="sm" variant="outline" onClick={() => remove(item.id)}><Trash2 className="h-3 w-3" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

const AnnouncementDialog = ({ open, onOpenChange, form, setForm, onSave, editing }: any) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-lg">
      <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} Announcement</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <Input placeholder="Excerpt" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} />
        <Textarea placeholder="Content" rows={4} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
        <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {["general", "academic", "administrative", "events", "urgent"].map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} /> Featured</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} /> Published</label>
        </div>
        <Button onClick={onSave} className="w-full">{editing ? "Update" : "Create"}</Button>
      </div>
    </DialogContent>
  </Dialog>
);

// ─── Events Tab ──────────────────────────────────────────
const EventsTab = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", location: "", start_date: "", end_date: "", category: "general", is_published: true });
  const { toast } = useToast();

  const fetchItems = async () => {
    const { data } = await supabase.from("events").select("*").order("start_date", { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { setEditing(null); setForm({ title: "", description: "", location: "", start_date: "", end_date: "", category: "general", is_published: true }); setDialogOpen(true); };
  const openEdit = (item: any) => { setEditing(item); setForm({ title: item.title, description: item.description || "", location: item.location || "", start_date: item.start_date?.slice(0, 16) || "", end_date: item.end_date?.slice(0, 16) || "", category: item.category || "general", is_published: item.is_published }); setDialogOpen(true); };

  const save = async () => {
    if (!form.title || !form.start_date) { toast({ title: "Title and start date required", variant: "destructive" }); return; }
    const payload = { ...form, end_date: form.end_date || null };
    let error;
    if (editing) {
      ({ error } = await supabase.from("events").update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("events").insert(payload));
    }
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: editing ? "Updated" : "Created" }); setDialogOpen(false); fetchItems(); }
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); fetchItems(); }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Events ({items.length})</CardTitle>
        <Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-1" /> New</Button>
      </CardHeader>
      <CardContent>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} Event</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="Description" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <Input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-xs text-muted-foreground">Start</label><Input type="datetime-local" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} /></div>
                <div><label className="text-xs text-muted-foreground">End</label><Input type="datetime-local" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} /></div>
              </div>
              <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["general", "academic", "sports", "cultural", "ceremony"].map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} /> Published</label>
              <Button onClick={save} className="w-full">{editing ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
        {loading ? <p className="text-muted-foreground">Loading...</p> : items.length === 0 ? <p className="text-muted-foreground">No events.</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell className="text-sm">{format(new Date(item.start_date), "MMM d, yyyy")}</TableCell>
                  <TableCell>{item.location || "—"}</TableCell>
                  <TableCell className="capitalize">{item.category}</TableCell>
                  <TableCell>{item.is_published ? <Badge>Live</Badge> : <Badge variant="secondary">Draft</Badge>}</TableCell>
                  <TableCell className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => openEdit(item)}><Pencil className="h-3 w-3" /></Button>
                    <Button size="sm" variant="outline" onClick={() => remove(item.id)}><Trash2 className="h-3 w-3" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

// ─── Downloads Tab ───────────────────────────────────────
const DownloadsTab = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", file_url: "", file_type: "pdf", file_size: "", category: "general", is_published: true });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const fetchItems = async () => {
    const { data } = await supabase.from("downloads").select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { setEditing(null); setForm({ title: "", description: "", file_url: "", file_type: "pdf", file_size: "", category: "general", is_published: true }); setDialogOpen(true); };
  const openEdit = (item: any) => { setEditing(item); setForm({ title: item.title, description: item.description || "", file_url: item.file_url, file_type: item.file_type || "pdf", file_size: item.file_size || "", category: item.category || "general", is_published: item.is_published }); setDialogOpen(true); };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("documents").upload(path, file);
    if (error) { toast({ title: "Upload error", description: error.message, variant: "destructive" }); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("documents").getPublicUrl(path);
    const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
    const size = file.size < 1024 * 1024 ? `${(file.size / 1024).toFixed(0)} KB` : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    setForm(f => ({ ...f, file_url: urlData.publicUrl, file_type: ext, file_size: size, title: f.title || file.name.replace(/\.[^/.]+$/, "") }));
    setUploading(false);
    toast({ title: "File uploaded" });
  };

  const save = async () => {
    if (!form.title || !form.file_url) { toast({ title: "Title and file required", variant: "destructive" }); return; }
    let error;
    if (editing) {
      ({ error } = await supabase.from("downloads").update(form).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("downloads").insert(form));
    }
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: editing ? "Updated" : "Created" }); setDialogOpen(false); fetchItems(); }
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("downloads").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); fetchItems(); }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Documents ({items.length})</CardTitle>
        <Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Upload</Button>
      </CardHeader>
      <CardContent>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Edit" : "Upload"} Document</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">File</label>
                <Input type="file" onChange={handleUpload} disabled={uploading} />
                {form.file_url && <p className="text-xs text-muted-foreground mt-1 truncate">{form.file_url}</p>}
              </div>
              <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="Description" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["admissions", "academic", "clinical", "financial", "general"].map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={form.file_type} onValueChange={v => setForm({ ...form, file_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["pdf", "doc", "xls", "ppt", "jpg", "png", "zip"].map(c => <SelectItem key={c} value={c}>{c.toUpperCase()}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} /> Published</label>
              <Button onClick={save} className="w-full" disabled={uploading}>{editing ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
        {loading ? <p className="text-muted-foreground">Loading...</p> : items.length === 0 ? <p className="text-muted-foreground">No documents.</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">{item.title}</TableCell>
                  <TableCell className="uppercase">{item.file_type}</TableCell>
                  <TableCell>{item.file_size || "—"}</TableCell>
                  <TableCell className="capitalize">{item.category}</TableCell>
                  <TableCell>{item.download_count}</TableCell>
                  <TableCell>{item.is_published ? <Badge>Live</Badge> : <Badge variant="secondary">Draft</Badge>}</TableCell>
                  <TableCell className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => openEdit(item)}><Pencil className="h-3 w-3" /></Button>
                    <Button size="sm" variant="outline" onClick={() => remove(item.id)}><Trash2 className="h-3 w-3" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

// ─── Payments Tab ────────────────────────────────────────
const PaymentsTab = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPayments = async () => {
    const { data } = await supabase.from("fee_payments").select("*").order("created_at", { ascending: false });
    if (data) setPayments(data);
    setLoading(false);
  };

  useEffect(() => { fetchPayments(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("fee_payments").update({ status }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: `Payment ${status}` }); fetchPayments(); }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Fee Payments ({payments.length})</CardTitle></CardHeader>
      <CardContent>
        {loading ? <p className="text-muted-foreground">Loading...</p> : payments.length === 0 ? <p className="text-muted-foreground">No payments.</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-sm">{p.reference_number || "—"}</TableCell>
                  <TableCell>GH₵ {Number(p.amount).toFixed(2)}</TableCell>
                  <TableCell className="capitalize">{p.payment_method?.replace("_", " ")}</TableCell>
                  <TableCell>{p.semester || "—"}</TableCell>
                  <TableCell>{p.academic_year || "—"}</TableCell>
                  <TableCell><Badge variant={p.status === "verified" ? "default" : p.status === "rejected" ? "destructive" : "secondary"}>{p.status}</Badge></TableCell>
                  <TableCell className="text-sm">{format(new Date(p.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => updateStatus(p.id, "verified")} disabled={p.status === "verified"}><Check className="h-3 w-3" /></Button>
                    <Button size="sm" variant="outline" onClick={() => updateStatus(p.id, "rejected")} disabled={p.status === "rejected"}><X className="h-3 w-3" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

// ─── Gallery Tab ────────────────────────────────────────
const GalleryTab = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", image_url: "", category: "general", is_published: true });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const fetchItems = async () => {
    const { data } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { setEditing(null); setForm({ title: "", description: "", image_url: "", category: "general", is_published: true }); setDialogOpen(true); };
  const openEdit = (item: any) => { setEditing(item); setForm({ title: item.title, description: item.description || "", image_url: item.image_url, category: item.category || "general", is_published: item.is_published }); setDialogOpen(true); };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("gallery").upload(path, file);
    if (error) { toast({ title: "Upload error", description: error.message, variant: "destructive" }); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(path);
    setForm(f => ({ ...f, image_url: urlData.publicUrl, title: f.title || file.name.replace(/\.[^/.]+$/, "") }));
    setUploading(false);
    toast({ title: "Image uploaded" });
  };

  const save = async () => {
    if (!form.title || !form.image_url) { toast({ title: "Title and image required", variant: "destructive" }); return; }
    let error;
    if (editing) {
      ({ error } = await supabase.from("gallery").update(form).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("gallery").insert(form));
    }
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: editing ? "Updated" : "Added" }); setDialogOpen(false); fetchItems(); }
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); fetchItems(); }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Photo Gallery ({items.length})</CardTitle>
        <Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Add Photo</Button>
      </CardHeader>
      <CardContent>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Photo</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Image</label>
                <Input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
                {uploading && <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin" /> Uploading...</div>}
                {form.image_url && <img src={form.image_url} alt="Preview" className="mt-2 rounded-md max-h-40 object-cover" />}
              </div>
              <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="Description" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["general", "campus", "events", "sports", "graduation", "laboratory"].map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} /> Published</label>
              <Button onClick={save} className="w-full" disabled={uploading}>{editing ? "Update" : "Add Photo"}</Button>
            </div>
          </DialogContent>
        </Dialog>
        {loading ? <p className="text-muted-foreground">Loading...</p> : items.length === 0 ? <p className="text-muted-foreground">No photos yet.</p> : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(item => (
              <div key={item.id} className="relative group rounded-lg overflow-hidden border">
                <img src={item.image_url} alt={item.title} className="w-full h-40 object-cover" />
                <div className="p-2">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <Badge variant={item.is_published ? "default" : "secondary"} className="text-xs">{item.category}</Badge>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => openEdit(item)}><Pencil className="h-3 w-3" /></Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => remove(item.id)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </div>
                </div>
                {!item.is_published && <div className="absolute top-2 right-2"><Badge variant="secondary">Draft</Badge></div>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ─── Users Tab ──────────────────────────────────────────
const UsersTab = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const fetchData = async () => {
    const [profilesRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*"),
    ]);
    if (profilesRes.data) setUsers(profilesRes.data);
    if (rolesRes.data) setRoles(rolesRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const getUserRole = (userId: string) => {
    const r = roles.find(r => r.user_id === userId);
    return r?.role || "user";
  };

  const assignRole = async (userId: string, role: string) => {
    const existing = roles.find(r => r.user_id === userId);
    if (role === "user") {
      if (existing) {
        const { error } = await supabase.from("user_roles").delete().eq("id", existing.id);
        if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      }
    } else {
      if (existing) {
        const { error } = await supabase.from("user_roles").update({ role: role as any }).eq("id", existing.id);
        if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      } else {
        const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: role as any });
        if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      }
    }
    toast({ title: `Role updated to ${role}` });
    fetchData();
  };

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const roleBadge = (role: string) => {
    if (role === "admin") return "destructive" as const;
    if (role === "moderator") return "default" as const;
    return "secondary" as const;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Registered Users ({users.length})</CardTitle>
        <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
      </CardHeader>
      <CardContent>
        {loading ? <p className="text-muted-foreground">Loading...</p> : filtered.length === 0 ? <p className="text-muted-foreground">No users found.</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Profile Role</TableHead>
                <TableHead>System Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Assign Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(u => {
                const currentRole = getUserRole(u.id);
                return (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.full_name || "—"}</TableCell>
                    <TableCell>{u.email || "—"}</TableCell>
                    <TableCell>{u.phone || "—"}</TableCell>
                    <TableCell className="capitalize">{u.role}</TableCell>
                    <TableCell><Badge variant={roleBadge(currentRole)} className="capitalize">{currentRole}</Badge></TableCell>
                    <TableCell className="text-sm">{format(new Date(u.created_at), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <Select value={currentRole} onValueChange={v => assignRole(u.id, v)}>
                        <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
