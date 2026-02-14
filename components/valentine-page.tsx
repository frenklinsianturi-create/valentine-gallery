"use client"

import React, { useMemo, useRef, useState } from "react"
import {
  Check,
  Edit2,
  Heart,
  Image as ImageIcon,
  Link as LinkIcon,
  Music,
  Pause,
  Play,
  Plus,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

type Photo = {
  id: number
  url: string
  label: string
}

const DEFAULT_PHOTOS: Photo[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1200&h=1200&fit=crop",
    label: "ESSS TROSSS😅",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=1200&fit=crop",
    label: "Nonton Bareng😊",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=1200&h=1200&fit=crop",
    label: "KECE BADAI😝",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=1200&fit=crop",
    label: "Bahagia",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1516589178587-6ac977e61eff?w=1200&h=1200&fit=crop",
    label: "Kenangan",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1513161455079-7ef1a827068d?w=1200&h=1200&fit=crop",
    label: "Masa Depan",
  },
]

function clampText(s: string, max = 90) {
  const v = (s ?? "").trim()
  if (!v) return ""
  if (v.length <= max) return v
  return `${v.slice(0, max - 1)}…`
}

export default function ValentinePage() {
  const [mainTitle, setMainTitle] = useState("Happy Valentine Sayang")
  const [subtitle, setSubtitle] = useState("Cinta bukan hanya tentang hari ini, tapi tentang setiap hari yang kita lewati dengan sabar, belajar, dan saling memahami. Terima kasih sudah menjadi bagian terpenting dalam hidupku")

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false)

  const [photos, setPhotos] = useState<Photo[]>(DEFAULT_PHOTOS)

  const [isMusicDialogOpen, setIsMusicDialogOpen] = useState(false)
  const [tempMusicUrl, setTempMusicUrl] = useState("")
  const [musicUrl, setMusicUrl] = useState<string>("/music/kasih.mp3")

  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [editingPhotoId, setEditingPhotoId] = useState<number | null>(null)
  const editingPhoto = useMemo(
    () => photos.find((p) => p.id === editingPhotoId) ?? null,
    [photos, editingPhotoId]
  )

  const [draftPhotoUrl, setDraftPhotoUrl] = useState("")
  const [draftPhotoLabel, setDraftPhotoLabel] = useState("")

  const nextPhotoId = useMemo(
    () => (photos.length ? Math.max(...photos.map((p) => p.id)) + 1 : 1),
    [photos]
  )

  const hearts = useMemo(() => {
    return Array.from({ length: 9 }).map((_, i) => ({
      id: i + 1,
      left: `${(i * 11 + 7) % 100}%`,
      top: `${(i * 17 + 9) % 90}%`,
      size: 22 + ((i * 13) % 34),
      dur: 4.6 + ((i * 11) % 26) / 10,
      delay: ((i * 7) % 20) / 10,
      opacity: 0.08 + (((i * 9) % 10) / 100),
    }))
  }, [])

  const applyMusic = () => {
    const url = tempMusicUrl.trim()
    if (!url) return
    setMusicUrl(url)
    setIsMusicDialogOpen(false)

    window.setTimeout(() => {
      if (!audioRef.current) return
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false)
        })
    }, 50)
  }

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      return
    }

    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        setIsPlaying(false)
        alert("Musik tidak bisa diputar. Pastikan URL MP3 bisa diakses publik.")
      })
  }

  const openEditPhoto = (p: Photo) => {
    setEditingPhotoId(p.id)
    setDraftPhotoUrl(p.url)
    setDraftPhotoLabel(p.label)
  }

  const savePhotoEdit = () => {
    if (!editingPhotoId) return
    const nextUrl = draftPhotoUrl.trim()
    const nextLabel = draftPhotoLabel.trim()

    setPhotos((prev) =>
      prev.map((p) =>
        p.id === editingPhotoId
          ? {
              ...p,
              url: nextUrl || p.url,
              label: nextLabel || p.label,
            }
          : p
      )
    )

    setEditingPhotoId(null)
  }

  const removePhoto = (id: number) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  const addPhoto = () => {
    setPhotos((prev) => [
      ...prev,
      {
        id: nextPhotoId,
        url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&h=1200&fit=crop",
        label: "Foto Baru",
      },
    ])
  }

  return (
    <div className="min-h-screen val-shimmer val-noise overflow-hidden">
     {musicUrl && (
  <audio
    ref={audioRef}
    src={musicUrl}
    loop
    autoPlay
    muted={isMuted}
    playsInline
    onPlay={() => setIsPlaying(true)}
    onPause={() => setIsPlaying(false)}
    data-testid="audio-background"
  />
)}


      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {hearts.map((h) => (
          <div
            key={h.id}
            className="absolute val-heart"
            style={{
              left: h.left,
              top: h.top,
              fontSize: `${h.size}px`,
              animationDuration: `${h.dur}s`,
              animationDelay: `${h.delay}s`,
              opacity: h.opacity,
            }}
          >
            <span style={{ color: "rgba(244,63,94,0.55)" }}>♥</span>
          </div>
        ))}
      </div>

      <header className="sticky top-0 z-30 w-full">
        <div className="mx-auto max-w-6xl px-4 pt-5">
          <div className="rounded-3xl border bg-white/70 backdrop-blur-xl shadow-[0_18px_50px_rgba(244,63,94,0.12)]">
            <div className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-[0_12px_30px_rgba(244,63,94,0.35)]">
                  <Heart className="h-5 w-5" fill="currentColor" />
                </div>
                <div>
                  <div className="font-display text-lg leading-none">Valentine Gallery</div>
                  <div className="text-xs text-muted-foreground">
                    Klik teks untuk edit • Tambah musik • Atur foto
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                {musicUrl ? (
                  <>
                    <Button
                      variant="default"
                      className="rounded-full bg-gradient-to-r from-rose-500 to-pink-600 shadow-[0_14px_30px_rgba(244,63,94,0.22)] hover:from-rose-500 hover:to-pink-600"
                      onClick={togglePlay}
                      data-testid={isPlaying ? "button-music-pause" : "button-music-play"}
                    >
                      {isPlaying ? (
                        <Pause className="mr-2 h-4 w-4" />
                      ) : (
                        <Play className="mr-2 h-4 w-4" />
                      )}
                      {isPlaying ? "Pause" : "Play"}
                    </Button>

                    <Button
                      variant="secondary"
                      className="rounded-full"
                      onClick={() => setIsMuted((v) => !v)}
                      data-testid={isMuted ? "button-music-unmute" : "button-music-mute"}
                    >
                      {isMuted ? (
                        <VolumeX className="mr-2 h-4 w-4" />
                      ) : (
                        <Volume2 className="mr-2 h-4 w-4" />
                      )}
                      {isMuted ? "Muted" : "Sound"}
                    </Button>

                    <Button
                      variant="ghost"
                      className="rounded-full"
                      onClick={() => {
                        setTempMusicUrl(musicUrl)
                        setIsMusicDialogOpen(true)
                      }}
                      data-testid="button-music-edit"
                    >
                      <Edit2 className="mr-2 h-4 w-4" />
                      Ubah
                    </Button>
                  </>
                ) : (
                  <Button
                    className="rounded-full bg-gradient-to-r from-rose-500 to-pink-600 shadow-[0_14px_30px_rgba(244,63,94,0.22)] hover:from-rose-500 hover:to-pink-600"
                    onClick={() => {
                      setTempMusicUrl("")
                      setIsMusicDialogOpen(true)
                    }}
                    data-testid="button-music-open"
                  >
                    <Music className="mr-2 h-4 w-4" />
                    Tambah Musik
                  </Button>
                )}

                <Button
                  variant="secondary"
                  className="rounded-full"
                  onClick={addPhoto}
                  data-testid="button-photo-add"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Foto
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-10">
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            className="mx-auto max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur-xl">
              <span className="font-display text-base text-foreground">💕</span>
              <span data-testid="text-subhead">Untuk kamu, yang bikin hari-hari jadi hangat.</span>
            </div>

            <div className="mt-7">
              <div
                className="group relative inline-block cursor-text"
                onClick={() => setIsEditingTitle(true)}
                data-testid="section-title"
              >
                {isEditingTitle ? (
                  <div className="flex items-center justify-center gap-2">
                    <Input
                      autoFocus
                      value={mainTitle}
                      onChange={(e) => setMainTitle(e.target.value)}
                      onBlur={() => setIsEditingTitle(false)}
                      onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
                      className="h-12 w-[min(680px,86vw)] rounded-2xl border-rose-200 bg-white/80 text-center text-2xl font-semibold shadow-sm backdrop-blur"
                      data-testid="input-title"
                    />
                    <Button
                      size="icon"
                      className="rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setIsEditingTitle(false)}
                      data-testid="button-title-save"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <h1
                      className="font-display text-4xl leading-[1.05] tracking-[-0.02em] text-transparent md:text-6xl"
                      style={{
                        backgroundImage:
                          "linear-gradient(90deg, hsl(343 86% 52%) 0%, hsl(332 92% 60%) 45%, hsl(12 90% 58%) 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                      }}
                      data-testid="text-title"
                    >
                      {mainTitle}
                    </h1>
                    <div className="pointer-events-none absolute -right-8 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <Edit2 className="h-4 w-4 text-rose-400" />
                    </div>
                  </>
                )}
              </div>

              <div className="mt-5">
                <div
                  className="group relative mx-auto inline-block cursor-text"
                  onClick={() => setIsEditingSubtitle(true)}
                  data-testid="section-subtitle"
                >
                  {isEditingSubtitle ? (
                    <Input
                      autoFocus
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      onBlur={() => setIsEditingSubtitle(false)}
                      onKeyDown={(e) => e.key === "Enter" && setIsEditingSubtitle(false)}
                      className="h-11 w-[min(720px,88vw)] rounded-2xl border-pink-200 bg-white/80 text-center text-base shadow-sm backdrop-blur"
                      data-testid="input-subtitle"
                    />
                  ) : (
                    <>
                      <p
                        className="mx-auto max-w-2xl text-balance text-base text-muted-foreground md:text-lg"
                        data-testid="text-subtitle"
                      >
                        {subtitle}
                      </p>
                      <div className="pointer-events-none absolute -right-7 top-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <Edit2 className="h-4 w-4 text-pink-400" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-2">
                <div className="rounded-full border bg-white/70 px-4 py-2 text-xs text-muted-foreground backdrop-blur">
                  <span className="font-medium text-foreground" data-testid="text-photo-count">
                    {photos.length}
                  </span>{" "}
                  foto
                </div>
                {musicUrl ? (
                  <div className="rounded-full border bg-white/70 px-4 py-2 text-xs text-muted-foreground backdrop-blur">
                    <span className="font-medium text-foreground" data-testid="status-music">
                      Musik aktif
                    </span>
                  </div>
                ) : (
                  <div className="rounded-full border bg-white/70 px-4 py-2 text-xs text-muted-foreground backdrop-blur">
                    <span className="font-medium text-foreground" data-testid="status-music">
                      Belum ada musik
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mt-12">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {photos.map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 14, scale: 0.98 }}
                  transition={{
                    duration: 0.5,
                    delay: Math.min(idx * 0.06, 0.28),
                    ease: [0.2, 0.8, 0.2, 1],
                  }}
                  className="group"
                  data-testid={`card-photo-${p.id}`}
                >
                  <div className="relative overflow-hidden rounded-3xl border bg-white/80 shadow-[0_18px_50px_rgba(244,63,94,0.12)] backdrop-blur transition-transform duration-300 will-change-transform group-hover:-translate-y-1 group-hover:shadow-[0_22px_64px_rgba(244,63,94,0.18)]">
                    <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
                      <div className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur">
                        <Heart className="h-3.5 w-3.5 text-rose-500" fill="currentColor" />
                        <span data-testid={`text-photo-label-${p.id}`}>{clampText(p.label, 32)}</span>
                      </div>
                    </div>

                    <div className="absolute right-4 top-4 z-10 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-9 w-9 rounded-2xl bg-white/85 backdrop-blur"
                        onClick={() => openEditPhoto(p)}
                        data-testid={`button-photo-edit-${p.id}`}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-9 w-9 rounded-2xl bg-white/85 backdrop-blur"
                        onClick={() => removePhoto(p.id)}
                        data-testid={`button-photo-delete-${p.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="relative">
<Image
  src={p.url}
  alt={p.label}
  width={1200}
  height={1200}
  className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
  data-testid={`img-photo-${p.id}`}
/>

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>

                    <div className="px-5 pb-5 pt-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div
                            className="text-sm font-semibold"
                            data-testid={`text-photo-title-${p.id}`}
                          >
                            {p.label}
                          </div>
                          <div
                            className="mt-1 text-xs text-muted-foreground"
                            data-testid={`text-photo-sub-${p.id}`}
                          >
                            Sentuh hati, simpan cerita.
                          </div>
                        </div>

                        <div className="inline-flex items-center gap-1 rounded-2xl bg-rose-50 px-3 py-2 text-xs text-rose-700">
                          <ImageIcon className="h-4 w-4" />
                          <span data-testid={`text-photo-id-${p.id}`}>#{p.id}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        <footer className="mt-14">
          <div className="mx-auto max-w-3xl rounded-3xl border bg-white/70 p-6 text-center shadow-[0_18px_50px_rgba(244,63,94,0.10)] backdrop-blur">
            <div className="font-display text-lg">Biar sederhana, tapi terasa.</div>
            <p className="mt-2 text-sm text-muted-foreground" data-testid="text-footer">
              Kamu bisa ganti foto dan judul kapan aja. Kalau mau, nanti kita bisa tambahin
              fitur surat cinta juga.
            </p>
          </div>
        </footer>
      </main>

      <Dialog open={isMusicDialogOpen} onOpenChange={setIsMusicDialogOpen}>
        <DialogContent className="rounded-3xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Tambah Musik Favorit</DialogTitle>
            <DialogDescription>
              Paste URL MP3 publik. Beberapa browser akan meminta kamu menekan Play dulu.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="music-url" className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-rose-500" />
                Link MP3
              </Label>
              <Textarea
                id="music-url"
                value={tempMusicUrl}
                onChange={(e) => setTempMusicUrl(e.target.value)}
                placeholder="https://contoh.com/lagu.mp3"
                className="min-h-24 rounded-2xl"
                data-testid="textarea-music-url"
              />
            </div>

            <div className="rounded-2xl border bg-rose-50/60 p-4 text-sm text-rose-900">
              <div className="font-semibold">Tips cepat</div>
              <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs text-rose-800">
                <li>Pastikan file benar-benar MP3 dan bisa diakses publik.</li>
                <li>Kalau autoplay tidak jalan, tekan tombol Play di atas.</li>
                <li>Gunakan hosting file yang mengizinkan hotlink.</li>
              </ol>
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="flex-1 rounded-2xl"
                onClick={() => setIsMusicDialogOpen(false)}
                data-testid="button-music-cancel"
              >
                Batal
              </Button>
              <Button
                className="flex-1 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-600"
                onClick={applyMusic}
                data-testid="button-music-apply"
              >
                <Music className="mr-2 h-4 w-4" />
                Pakai Musik
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingPhotoId} onOpenChange={(v) => !v && setEditingPhotoId(null)}>
        <DialogContent className="rounded-3xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Edit Foto</DialogTitle>
            <DialogDescription>
              Ganti label dan URL gambar. Tips: gunakan ukuran besar biar tajam.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="photo-label">Label</Label>
              <Input
                id="photo-label"
                value={draftPhotoLabel}
                onChange={(e) => setDraftPhotoLabel(e.target.value)}
                className="rounded-2xl"
                data-testid="input-photo-label"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo-url">URL Gambar</Label>
              <Textarea
                id="photo-url"
                value={draftPhotoUrl}
                onChange={(e) => setDraftPhotoUrl(e.target.value)}
                className="min-h-24 rounded-2xl"
                data-testid="textarea-photo-url"
              />
              <div className="text-xs text-muted-foreground">
                Preview akan update setelah kamu simpan.
              </div>
            </div>

            {editingPhoto ? (
              <div className="overflow-hidden rounded-2xl border bg-white">
                <img
                  src={draftPhotoUrl || editingPhoto.url}
                  alt={editingPhoto.label}
                  className="h-44 w-full object-cover"
                  loading="lazy"
                  data-testid="img-photo-preview"
                  onError={(e) => {
                    const img = e.currentTarget
                    img.src =
                      "https://via.placeholder.com/1200x600?text=Preview+Error"
                  }}
                />
              </div>
            ) : null}

            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="flex-1 rounded-2xl"
                onClick={() => setEditingPhotoId(null)}
                data-testid="button-photo-edit-cancel"
              >
                Batal
              </Button>
              <Button
                className="flex-1 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-600"
                onClick={savePhotoEdit}
                data-testid="button-photo-edit-save"
              >
                <Check className="mr-2 h-4 w-4" />
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-5 right-5 z-40">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-2 rounded-full border bg-white/80 px-4 py-3 text-sm font-semibold shadow-[0_18px_50px_rgba(244,63,94,0.14)] backdrop-blur transition-colors hover:bg-white"
          data-testid="button-scroll-top"
          type="button"
        >
          <Heart className="h-4 w-4 text-rose-500" fill="currentColor" />
          Ke atas
        </motion.button>
      </div>
    </div>
  )
}
