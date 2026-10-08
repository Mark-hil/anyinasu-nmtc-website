import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

const CoursesTab = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    code: "", title: "", credits: 3, program: "", semester: "", description: "", outline: "", is_published: true
  });
  const { toast } = useToast();

  const fetchItems = async () => {
    const { data } = await supabase.from("courses").select("*").order("code");
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ code: "", title: "", credits: 3, program: "", semester: "", description: "", outline: "", is_published: true });
    setDialogOpen(true);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    setForm({
      code: item.code, title: item.title, credits: item.credits,
      program: item.program || "", semester: item.semester || "",
      description: item.description || "", outline: item.outline || "",
      is_published: item.is_published
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.code || !form.title) {
      toast({ title: "Code and title required", variant: "destructive" });
      return;
    }
    let error;
    if (editing) {
      ({ error } = await supabase.from("courses").update(form).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("courses").insert(form));
    }
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: editing ? "Updated" : "Course created" }); setDialogOpen(false); fetchItems(); }
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); fetchItems(); }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Courses ({items.length})</CardTitle>
        <Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Add Course</Button>
      </CardHeader>
      <CardContent>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} Course</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Course Code (e.g. NUR 201)" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
                <Input type="number" placeholder="Credits" value={form.credits} onChange={e => setForm({ ...form, credits: parseInt(e.target.value) || 0 })} />
              </div>
              <Input placeholder="Course Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Program (e.g. Registered General Nursing)" value={form.program} onChange={e => setForm({ ...form, program: e.target.value })} />
                <Input placeholder="Semester (e.g. Semester 1)" value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })} />
              </div>
              <Textarea placeholder="Course Description" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <Textarea placeholder="Course Outline (topics, modules, weekly breakdown...)" rows={6} value={form.outline} onChange={e => setForm({ ...form, outline: e.target.value })} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} /> Published
              </label>
              <Button onClick={save} className="w-full">{editing ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>

        {loading ? <p className="text-muted-foreground">Loading...</p> : items.length === 0 ? <p className="text-muted-foreground">No courses yet.</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs">{item.code}</TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.credits}</TableCell>
                  <TableCell className="text-sm">{item.program || "—"}</TableCell>
                  <TableCell className="text-sm">{item.semester || "—"}</TableCell>
                  <TableCell>{item.is_published ? <Badge>Active</Badge> : <Badge variant="secondary">Draft</Badge>}</TableCell>
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

export default CoursesTab;
