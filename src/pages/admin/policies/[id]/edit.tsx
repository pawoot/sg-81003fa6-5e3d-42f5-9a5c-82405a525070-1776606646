import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { generateSlug } from "@/lib/utils";
import { ArrowLeft, Plus, Trash2, Save, AlertCircle } from "lucide-react";
import Link from "next/link";
import type { Cluster, Minister, PolicyDetail, Milestone } from "@/lib/types";

export default function EditPolicyPage() {
  const router = useRouter();
  const { id } = router.query;
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [ministers, setMinisters] = useState<Minister[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    policy_number: "",
    title: "",
    description: "",
    original_text: "",
    cluster_id: "",
    minister_id: "",
    status: "planned",
    priority: "normal",
    target_date: "",
    target_date_type: "soft_target",
    is_featured: false,
    slug: "",
  });

  const [milestones, setMilestones] = useState<Milestone[]>([]);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      if (!id) return;

      try {
        // Load clusters and ministers
        const [clustersRes, ministersRes] = await Promise.all([
          supabase.from("clusters").select("*").order("id"),
          supabase.from("ministers").select("*").order("full_name"),
        ]);

        if (clustersRes.data) setClusters(clustersRes.data);
        if (ministersRes.data) setMinisters(ministersRes.data);

        // Load policy data
        const { data: policy, error: policyError } = await supabase
          .from("policies")
          .select(`
            *,
            milestones (*)
          `)
          .eq("id", id)
          .single();

        if (policyError) {
          throw policyError;
        }

        if (policy) {
          setFormData({
            policy_number: policy.policy_number || "",
            title: policy.title || "",
            description: policy.description || "",
            original_text: policy.original_text || "",
            cluster_id: policy.cluster_id ? String(policy.cluster_id) : "",
            minister_id: policy.minister_id ? String(policy.minister_id) : "",
            status: policy.status || "planned",
            priority: policy.priority || "normal",
            target_date: policy.target_date || "",
            target_date_type: policy.target_date_type || "soft_target",
            is_featured: policy.is_featured || false,
            slug: policy.slug || "",
          });

          // Set milestones
          const policyMilestones = Array.isArray(policy.milestones) ? policy.milestones : [];
          if (policyMilestones.length > 0) {
            setMilestones(
              policyMilestones.map((m) => ({
                name: m.name || "",
                milestone_order: m.milestone_order || 0,
                weight_percent: Number(m.weight_percent) || 0,
                target_date: m.target_date || "",
              }))
            );
          } else {
            setMilestones([
              { name: "", milestone_order: 1, weight_percent: 0, target_date: "" },
            ]);
          }
        }
      } catch (err: any) {
        console.error("Error loading policy:", err);
        setError(err.message);
      } finally {
        setPageLoading(false);
      }
    }

    loadData();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Generate new slug if title changed
      const slug = generateSlug(formData.title);

      // Prepare policy data
      const policyData = {
        policy_number: formData.policy_number,
        title: formData.title,
        description: formData.description,
        original_text: formData.original_text,
        cluster_id: formData.cluster_id ? parseInt(formData.cluster_id) : null,
        minister_id: formData.minister_id ? parseInt(formData.minister_id) : null,
        status: formData.status,
        priority: formData.priority,
        target_date: formData.target_date || null,
        target_date_type: formData.target_date_type,
        is_featured: formData.is_featured,
        slug,
      };

      // Filter out empty milestones
      const validMilestones = milestones
        .filter((m) => m.name.trim() !== "")
        .map((m, index) => ({
          ...m,
          milestone_order: index + 1,
        }));

      const response = await fetch("/api/admin/policies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          policy: policyData,
          milestones: validMilestones,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update policy");
      }

      router.push("/admin/policies");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        name: "",
        milestone_order: milestones.length + 1,
        weight_percent: 0,
        target_date: "",
      },
    ]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const updateMilestone = (index: number, field: keyof Milestone, value: any) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  if (pageLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error && !formData.title) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="font-heading font-bold text-2xl mb-2">เกิดข้อผิดพลาด</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link
              href="/admin/policies"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              กลับไปจัดการนโยบาย
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <SEO title={`แก้ไข: ${formData.title} | Admin`} />

      <div className="mb-6">
        <Link
          href="/admin/policies"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับไปจัดการนโยบาย
        </Link>
        <h1 className="font-heading font-bold text-3xl">แก้ไขนโยบาย</h1>
        <p className="text-muted-foreground mt-1">{formData.policy_number}: {formData.title}</p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <h2 className="font-heading font-semibold text-xl mb-4">ข้อมูลพื้นฐาน</h2>
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  หมายเลขนโยบาย <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.policy_number}
                  onChange={(e) => setFormData({ ...formData, policy_number: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="เช่น 20a, 1.1, 22"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  สถานะ <span className="text-destructive">*</span>
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="planned">วางแผน</option>
                  <option value="in_progress">กำลังดำเนินการ</option>
                  <option value="delayed">ล่าช้า</option>
                  <option value="completed">เสร็จสิ้น</option>
                  <option value="cancelled">ยกเลิก</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                ชื่อนโยบาย <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="ชื่อเต็มของนโยบาย"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">คำอธิบาย</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="สรุปสั้นๆ เกี่ยวกับนโยบาย"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">ข้อความต้นฉบับ</label>
              <textarea
                value={formData.original_text}
                onChange={(e) => setFormData({ ...formData, original_text: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="ข้อความจากการแถลงนโยบายต่อรัฐสภา (ถ้ามี)"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">กลุ่มยุทธศาสตร์</label>
                <select
                  value={formData.cluster_id}
                  onChange={(e) => setFormData({ ...formData, cluster_id: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">- เลือกกลุ่ม -</option>
                  {clusters.map((cluster) => (
                    <option key={cluster.id} value={cluster.id}>
                      {cluster.icon} {cluster.short_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">รัฐมนตรีผู้รับผิดชอบ</label>
                <select
                  value={formData.minister_id}
                  onChange={(e) => setFormData({ ...formData, minister_id: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">- เลือกรัฐมนตรี -</option>
                  {ministers.map((minister) => (
                    <option key={minister.id} value={minister.id}>
                      {minister.title} {minister.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">ความสำคัญ</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="normal">ปกติ</option>
                  <option value="high">สำคัญมาก</option>
                  <option value="urgent">ด่วนที่สุด</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">วันที่กำหนดเสร็จ</label>
                <input
                  type="date"
                  value={formData.target_date}
                  onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ประเภทกำหนดเวลา</label>
                <select
                  value={formData.target_date_type}
                  onChange={(e) => setFormData({ ...formData, target_date_type: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="soft_target">เป้าหมายอ่อน</option>
                  <option value="hard_deadline">กำหนดเวลาแน่นอน</option>
                  <option value="ongoing">ดำเนินการต่อเนื่อง</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm font-medium">แสดงในนโยบายเด่น (Featured)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-xl">ขั้นตอน (Milestones)</h2>
            <button
              type="button"
              onClick={addMilestone}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              เพิ่มขั้นตอน
            </button>
          </div>

          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <span className="font-semibold text-sm text-muted-foreground">
                    ขั้นตอนที่ {index + 1}
                  </span>
                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid gap-4">
                  <div>
                    <input
                      type="text"
                      value={milestone.name}
                      onChange={(e) => updateMilestone(index, "name", e.target.value)}
                      placeholder="ชื่อขั้นตอน"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={milestone.weight_percent}
                        onChange={(e) =>
                          updateMilestone(index, "weight_percent", parseFloat(e.target.value) || 0)
                        }
                        placeholder="น้ำหนัก %"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <input
                        type="date"
                        value={milestone.target_date}
                        onChange={(e) => updateMilestone(index, "target_date", e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {milestones.length === 0 && (
            <p className="text-muted-foreground text-sm">ยังไม่มีขั้นตอน - คลิก "เพิ่มขั้นตอน" ด้านบน</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
          </button>
          <Link
            href="/admin/policies"
            className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors font-semibold"
          >
            ยกเลิก
          </Link>
        </div>
      </form>
    </AdminLayout>
  );
}