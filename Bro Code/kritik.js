/* =====================================================
   LAPISAN DATA
   Hanya dua fungsi ini yang berhubungan dengan penyimpanan.
   Sekarang memakai localStorage agar bisa dicoba tanpa server.
   Nanti, cukup ganti isi kedua fungsi ini ke database.
   Bagian tampilan di bawahnya tidak perlu diubah.
   ===================================================== */

const STORAGE_KEY = 'guestbook_messages';

// Mengambil semua pesan, urut dari yang terbaru
async function getMessages() {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Menyimpan satu pesan baru, mengembalikan pesan yang tersimpan
async function addMessage({ nama, pesan, rating }) {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : [];
    const item = {
        id: Date.now(),
        nama,
        pesan,
        rating,
        createdAt: new Date().toISOString()
    };
    data.push(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return item;
}

// Menghapus satu pesan berdasarkan id
async function deleteMessage(id) {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : [];
    const sisa = data.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sisa));
}

/* =====================================================
   TAMPILAN
   ===================================================== */

const form    = document.getElementById('gb-form');
const inNama  = document.getElementById('gb-nama');
const inPesan = document.getElementById('gb-pesan');
const count   = document.getElementById('gb-count');
const errBox  = document.getElementById('gb-error');
const btn     = document.getElementById('gb-submit');
const list    = document.getElementById('gb-list');
const empty   = document.getElementById('gb-empty');
const total   = document.getElementById('gb-total');
const ratingText = document.getElementById('gb-rating-text');

// Warna avatar tetap untuk tiap nama
const WARNA = ['#8f8f8f', '#5f7a61', '#7a5f5f', '#5f6f7a', '#7a6f5f', '#6b5f7a'];

function warnaDari(nama) {
    let h = 0;
    for (const c of nama) h = (h * 31 + c.charCodeAt(0)) % WARNA.length;
    return WARNA[h];
}

function formatWaktu(iso) {
    return new Date(iso).toLocaleString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

// Dibuat dengan textContent agar aman dari injeksi HTML/script
function buatItem(m) {
    const li = document.createElement('li');
    li.className = 'gb-item';

    const avatar = document.createElement('div');
    avatar.className = 'gb-avatar';
    avatar.textContent = m.nama.trim().charAt(0).toUpperCase();
    avatar.style.background = warnaDari(m.nama);

    const body = document.createElement('div');

    const meta = document.createElement('div');
    meta.className = 'gb-meta';

    const nama = document.createElement('span');
    nama.className = 'gb-nama';
    nama.textContent = m.nama;

    const waktu = document.createElement('span');
    waktu.className = 'gb-waktu';
    waktu.textContent = formatWaktu(m.createdAt);

    const isi = document.createElement('p');
    isi.className = 'gb-isi';
    isi.textContent = m.pesan;

    meta.append(nama, waktu);
    if (m.rating) {
        const skor = document.createElement('span');
        skor.className = 'gb-skor';
        skor.textContent = '★ ' + m.rating + '/10';
        meta.append(skor);
    }
    const hapus = document.createElement('button');
    hapus.type = 'button';
    hapus.className = 'gb-hapus';
    hapus.dataset.id = m.id;
    hapus.textContent = 'Hapus';
    meta.append(hapus);

    body.append(meta, isi);
    li.append(avatar, body);
    return li;
}

async function render() {
    const messages = await getMessages();
    list.replaceChildren(...messages.map(buatItem));
    empty.hidden = messages.length > 0;
    total.textContent = messages.length + ' masukan';
}

function tampilError(teks) {
    errBox.textContent = teks;
    errBox.hidden = !teks;
}

// Satu listener untuk semua tombol Hapus (event delegation)
list.addEventListener('click', async (e) => {
    const tombol = e.target.closest('.gb-hapus');
    if (!tombol) return;

    if (!confirm('Hapus pesan ini?')) return;

    tombol.disabled = true;
    try {
        await deleteMessage(Number(tombol.dataset.id));
        await render();
    } catch (err) {
        console.error(err);
        tombol.disabled = false;
        alert('Pesan gagal dihapus. Coba lagi.');
    }
});

form.addEventListener('change', (e) => {
    if (e.target.name === 'rating') {
        ratingText.textContent = e.target.value + ' dari 10';
    }
});

inPesan.addEventListener('input', () => {
    count.textContent = inPesan.value.length;
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    tampilError('');

    const nama  = inNama.value.trim();
    const pesan = inPesan.value.trim();
    const dipilih = form.querySelector('input[name="rating"]:checked');
    const rating = dipilih ? Number(dipilih.value) : null;

    if (!nama)   return tampilError('Nama wajib diisi.');
    if (!rating) return tampilError('Pilih rating 1 sampai 10.');
    if (!pesan)  return tampilError('Kritik dan saran wajib diisi.');

    btn.disabled = true;
    btn.textContent = 'Mengirim...';

    try {
        await addMessage({ nama, pesan, rating });
        form.reset();
        count.textContent = '0';
        ratingText.textContent = 'Belum dipilih';
        await render();
    } catch (err) {
        console.error(err);
        tampilError('Pesan gagal dikirim. Coba lagi.');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Kirim masukan';
    }
});

render();
