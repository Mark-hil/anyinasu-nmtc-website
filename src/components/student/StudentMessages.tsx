import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Inbox, Send, Plus, Loader2 } from "lucide-react";

interface Props { userId: string; }

const StudentMessages = ({ userId }: Props) => {
  const { toast } = useToast();
  const [tab, setTab] = useState<"inbox" | "sent">("inbox");
  const [messages, setMessages] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [reading, setReading] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ recipient_id: "", subject: "", body: "" });

  const fetchAll = async () => {
    const [m, p] = await Promise.all([
      supabase.from("messages").select("*").or(`sender_id.eq.${userId},recipient_id.eq.${userId}`).order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, full_name, email, role"),
    ]);
    if (m.data) setMessages(m.data);
    if (p.data) setProfiles(p.data);
    setLoading(false);
  };
  useEffect(() => { fetchAll(); }, [userId]);

  const inbox = messages.filter(m => m.recipient_id === userId);
  const sent = messages.filter(m => m.sender_id === userId);
  const unread = inbox.filter(m => !m.is_read).length;
  const list = tab === "inbox" ? inbox : sent;
  const nameOf = (id: string) => profiles.find(p => p.id === id)?.full_name || profiles.find(p => p.id === id)?.email || "Unknown";

  const send = async () => {
    if (!form.recipient_id || !form.subject || !form.body) { toast({ title: "All fields required", variant: "destructive" }); return; }
    const { error } = await supabase.from("messages").insert({ ...form, sender_id: userId });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Message sent" }); setOpen(false); setForm({ recipient_id: "", subject: "", body: "" }); fetchAll(); }
  };

  const read = async (m: any) => {
    setReading(m);
    if (!m.is_read && m.recipient_id === userId) {
      await supabase.from("messages").update({ is_read: true }).eq("id", m.id);
      fetchAll();
    }
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <Button variant={tab === "inbox" ? "default" : "ghost"} size="sm" onClick={() => setTab("inbox")}>
            <Inbox className="h-4 w-4 mr-1" /> Inbox {unread > 0 && <Badge className="ml-1">{unread}</Badge>}
          </Button>
          <Button variant={tab === "sent" ? "default" : "ghost"} size="sm" onClick={() => setTab("sent")}>
            <Send className="h-4 w-4 mr-1" /> Sent
          </Button>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-1" /> New Message</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {list.length === 0 ? <p className="p-8 text-center text-muted-foreground text-sm">No messages.</p> : (
            <div className="divide-y">
              {list.map(m => (
                <button key={m.id} onClick={() => read(m)} className={`w-full text-left p-4 hover:bg-accent transition ${!m.is_read && tab === "inbox" ? "bg-muted/50 font-medium" : ""}`}>
                  <div className="flex justify-between text-sm">
                    <span>{tab === "inbox" ? `From: ${nameOf(m.sender_id)}` : `To: ${nameOf(m.recipient_id)}`}</span>
                    <span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString("en-GB")}</span>
                  </div>
                  <p className="text-sm mt-1">{m.subject}</p>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Message</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Recipient</Label>
              <Select value={form.recipient_id} onValueChange={v => setForm({ ...form, recipient_id: v })}>
                <SelectTrigger><SelectValue placeholder="Choose recipient" /></SelectTrigger>
                <SelectContent>
                  {profiles.filter(p => p.id !== userId).map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.full_name || p.email} {p.role && `(${p.role})`}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
            <Textarea placeholder="Message" rows={6} value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} />
            <Button onClick={send} className="w-full"><Send className="h-4 w-4 mr-2" />Send</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!reading} onOpenChange={(o) => !o && setReading(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{reading?.subject}</DialogTitle></DialogHeader>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">From: {nameOf(reading?.sender_id)} • To: {nameOf(reading?.recipient_id)}</p>
            <p className="text-xs text-muted-foreground">{reading && new Date(reading.created_at).toLocaleString("en-GB")}</p>
            <div className="border-t pt-3 whitespace-pre-wrap">{reading?.body}</div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentMessages;
