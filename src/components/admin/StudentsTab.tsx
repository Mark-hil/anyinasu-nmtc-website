import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

const StudentsTab = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    user_id: "", student_id: "", program: "", level: "Level 100", semester: "Semester 1", gpa: 0, status: "active"
  });
  const { toast } = useToast();

  const fetchData = async () => {
    const [studentsRes, profilesRes] = await Promise.all([
      supabase.from("students").select("*").order("student_id"),
      supabase.from("profiles").select("id, full_name, email"),
    ]);
    if (studentsRes.data) setStudents(studentsRes.data);
    if (profilesRes.data) setProfiles(profilesRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const getProfileName = (userId: string) => profiles.find(p => p.id === userId)?.full_name || "—";
  const getProfileEmail = (userId: string) => profiles.find(p => p.id === userId)?.email || "—";

  const unlinkedProfiles = profiles.filter(p => !students.some(s => s.user_id === p.id));

  const openNew = () => {
    setEditing(null);
    setForm({ user_id: "", student_id: "", program: "", level: "Level 100", semester: "Semester 1", gpa: 0, status: "active" });
    setDialogOpen(true);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    setForm({
      user_id: item.user_id, student_id: item.student_id, program: item.program,
      level: item.level, semester: item.semester, gpa: Number(item.gpa), status: item.status
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.student_id || !form.program) {
      toast({ title: "Student ID and program required", variant: "destructive" });
      return;
    }
    let error;
    if (editing) {
      const { user_id, ...updateData } = form;
      ({ error } = await supabase.from("students").update(updateData).eq("id", editing.id));
    } else {
      if (!form.user_id) { toast({ title: "Select a user account", variant: "destructive" }); return; }
      ({ error } = await supabase.from("students").insert(form));
    }
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: editing ? "Updated" : "Student registered" }); setDialogOpen(false); fetchData(); }
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); fetchData(); }
  };

  const filtered = students.filter(s =>
    s.student_id.toLowerCase().includes(search.toLowerCase()) ||
    s.program.toLowerCase().includes(search.toLowerCase()) ||
    getProfileName(s.user_id).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Students ({students.length})</CardTitle>
        <div className="flex gap-2">
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
          <Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Register Student</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Edit" : "Register"} Student</DialogTitle></DialogHeader>
            <div className="space-y-3">
              {!editing && (
                <div>
                  <label className="text-xs text-muted-foreground">Link to User Account</label>
                  <Select value={form.user_id} onValueChange={v => setForm({ ...form, user_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select user account" /></SelectTrigger>
                    <SelectContent>
                      {unlinkedProfiles.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.full_name || p.email} ({p.email})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Input placeholder="Student ID (e.g. NTC/2024/0456)" value={form.student_id} onChange={e => setForm({ ...form, student_id: e.target.value })} />
              <Input placeholder="Program (e.g. Registered General Nursing)" value={form.program} onChange={e => setForm({ ...form, program: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <Select value={form.level} onValueChange={v => setForm({ ...form, level: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Level 100", "Level 200", "Level 300", "Level 400"].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={form.semester} onValueChange={v => setForm({ ...form, semester: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Semester 1", "Semester 2"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">GPA</label>
                  <Input type="number" step="0.01" min="0" max="4" value={form.gpa} onChange={e => setForm({ ...form, gpa: parseFloat(e.target.value) || 0 })} />
                </div>
                <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["active", "inactive", "graduated", "suspended"].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={save} className="w-full">{editing ? "Update" : "Register"}</Button>
            </div>
          </DialogContent>
        </Dialog>

        {loading ? <p className="text-muted-foreground">Loading...</p> : filtered.length === 0 ? <p className="text-muted-foreground">No students found.</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>GPA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.student_id}</TableCell>
                  <TableCell className="font-medium">{getProfileName(s.user_id)}</TableCell>
                  <TableCell className="text-sm">{getProfileEmail(s.user_id)}</TableCell>
                  <TableCell className="text-sm">{s.program}</TableCell>
                  <TableCell>{s.level}</TableCell>
                  <TableCell className="font-semibold">{Number(s.gpa).toFixed(2)}</TableCell>
                  <TableCell><Badge variant={s.status === "active" ? "default" : "secondary"} className="capitalize">{s.status}</Badge></TableCell>
                  <TableCell className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => openEdit(s)}><Pencil className="h-3 w-3" /></Button>
                    <Button size="sm" variant="outline" onClick={() => remove(s.id)}><Trash2 className="h-3 w-3" /></Button>
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

export default StudentsTab;
