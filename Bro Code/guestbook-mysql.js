(() => {
    const API_URL = 'api.php'; // Hubungkan ke file PHP backend

    let isAdmin = true; // Ubah sesuai kebutuhan autentikasi Anda

    async function getMessages() {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Gagal memuat data');
        return await response.json();
    }

    async function addMessage({ nama, pesan, rating }) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nama, pesan, rating })
        });
        if (!response.ok) throw new Error('Gagal mengirim pesan');
        return await response.json();
    }

    async function deleteMessage(id) {
        const response = await fetch(`${API_URL}?id=${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Gagal menghapus pesan');
        return await response.json();
    }

    /* ================= TAMPILAN (DOM) ================= */
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
        try {
            const messages = await getMessages();
            list.replaceChildren(...messages.map(buatItem));
            empty.hidden = messages.length > 0;
            total.textContent = messages.length + ' masukan';
        } catch (err) {
            console.error(err);
            errBox.textContent = 'Data gagal dimuat.';
            errBox.hidden = false;
        }
    }

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
            alert('Gagal menghapus pesan.');
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
        errBox.hidden = true;

        const nama  = inNama.value.trim();
        const pesan = inPesan.value.trim();
        const dipilih = form.querySelector('input[name="rating"]:checked');
        const rating = dipilih ? Number(dipilih.value) : null;

        if (!nama)   return (errBox.textContent = 'Nama wajib diisi.', errBox.hidden = false);
        if (!rating) return (errBox.textContent = 'Pilih rating 1 sampai 10.', errBox.hidden = false);
        if (!pesan)  return (errBox.textContent = 'Kritik dan saran wajib diisi.', errBox.hidden = false);

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
            errBox.textContent = 'Pesan gagal dikirim.';
            errBox.hidden = false;
        } finally {
            btn.disabled = false;
            btn.textContent = 'Kirim masukan';
        }
    });

    render();
})();