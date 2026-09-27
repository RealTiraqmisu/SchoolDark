/* ======================================================================
 *  parent-profile-editor.js — การ์ด "ข้อมูลผู้ปกครอง" แบบใช้ร่วมกัน
 *  (โหมดแสดง/แก้ไข + รูปโปรไฟล์ในปุ่มแก้ไขเดียวกัน) ใช้ทั้งใน profile.html
 *  และ settings.html#account (ตามที่ noeysod ขอให้แก้ที่เดียวจบทั้งข้อมูลและรูป)
 *
 *  วิธีใช้: window.ParentProfileEditor.mount(containerEl)
 *  ต้องโหลด js/parent-store.js และ js/parent-nav.js ก่อนไฟล์นี้เสมอ
 * ====================================================================== */

window.ParentProfileEditor = (function () {
  'use strict';

  function mount(container) {
    var esc = ParentUI.escapeHtml;

    container.innerHTML =
      '<div class="flex flex-col-reverse md:flex-row gap-6">' +
        '<div class="flex-1 min-w-0">' +
          '<div class="flex items-center justify-between mb-4">' +
            '<h2 class="font-bold text-card-foreground">ข้อมูลผู้ปกครอง</h2>' +
            '<button type="button" data-pf-edit class="border border-border text-card-foreground hover:bg-secondary rounded-lg px-3 py-1.5 text-sm flex items-center gap-1.5">' +
              '<i data-lucide="pencil" class="w-4 h-4"></i> แก้ไข</button>' +
          '</div>' +
          '<div data-pf-view class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm"></div>' +
          '<form data-pf-form class="hidden">' +
            '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">' +
              '<div>' +
                '<label for="pf-prefix" class="block text-sm font-medium text-card-foreground mb-1">คำนำหน้า</label>' +
                '<select id="pf-prefix" data-pf-prefix autocomplete="honorific-prefix" class="w-full rounded-lg border border-border px-3 py-2 text-sm">' +
                  '<option value="นาย">นาย</option>' +
                  '<option value="นาง">นาง</option>' +
                  '<option value="นางสาว">นางสาว</option>' +
                '</select>' +
              '</div>' +
              '<div></div>' +
              '<div>' +
                '<label for="pf-firstName" class="block text-sm font-medium text-card-foreground mb-1">ชื่อ</label>' +
                '<input type="text" id="pf-firstName" data-pf-firstName autocomplete="given-name" class="w-full rounded-lg border border-border px-3 py-2 text-sm">' +
              '</div>' +
              '<div>' +
                '<label for="pf-lastName" class="block text-sm font-medium text-card-foreground mb-1">นามสกุล</label>' +
                '<input type="text" id="pf-lastName" data-pf-lastName autocomplete="family-name" class="w-full rounded-lg border border-border px-3 py-2 text-sm">' +
              '</div>' +
              '<div>' +
                '<label for="pf-relation" class="block text-sm font-medium text-card-foreground mb-1">ความสัมพันธ์</label>' +
                '<select id="pf-relation" data-pf-relation class="w-full rounded-lg border border-border px-3 py-2 text-sm">' +
                  '<option value="บิดา">บิดา</option>' +
                  '<option value="มารดา">มารดา</option>' +
                  '<option value="ผู้ปกครอง">ผู้ปกครอง</option>' +
                '</select>' +
              '</div>' +
              '<div>' +
                '<label for="pf-phone" class="block text-sm font-medium text-card-foreground mb-1">เบอร์โทร</label>' +
                '<input type="tel" id="pf-phone" data-pf-phone autocomplete="tel" pattern="^0[0-9]{1,2}-?[0-9]{3,4}-?[0-9]{4}$" class="w-full rounded-lg border border-border px-3 py-2 text-sm">' +
              '</div>' +
              '<div>' +
                '<label for="pf-email" class="block text-sm font-medium text-card-foreground mb-1">อีเมล</label>' +
                '<input type="email" id="pf-email" data-pf-email autocomplete="email" class="w-full rounded-lg border border-border px-3 py-2 text-sm">' +
              '</div>' +
              '<div>' +
                '<label for="pf-lineId" class="block text-sm font-medium text-card-foreground mb-1">LINE ID</label>' +
                '<input type="text" id="pf-lineId" data-pf-lineId class="w-full rounded-lg border border-border px-3 py-2 text-sm">' +
              '</div>' +
              '<div>' +
                '<label for="pf-occupation" class="block text-sm font-medium text-card-foreground mb-1">อาชีพ</label>' +
                '<input type="text" id="pf-occupation" data-pf-occupation autocomplete="organization-title" class="w-full rounded-lg border border-border px-3 py-2 text-sm">' +
              '</div>' +
              '<div class="md:col-span-2">' +
                '<label for="pf-address" class="block text-sm font-medium text-card-foreground mb-1">ที่อยู่</label>' +
                '<textarea id="pf-address" data-pf-address autocomplete="street-address" rows="2" class="w-full rounded-lg border border-border px-3 py-2 text-sm"></textarea>' +
              '</div>' +
            '</div>' +
            '<div data-pf-error role="alert" class="text-destructive text-sm mt-3 hidden"></div>' +
            '<div class="mt-4 flex items-center justify-end gap-2">' +
              '<button type="button" data-pf-cancel class="border border-border text-card-foreground hover:bg-secondary rounded-lg px-4 py-2 font-medium">ยกเลิก</button>' +
              '<button type="submit" class="bg-primary hover:bg-primary-hover text-white rounded-lg px-4 py-2 font-medium">บันทึกการเปลี่ยนแปลง</button>' +
            '</div>' +
          '</form>' +
        '</div>' +
        '<div class="md:w-48 shrink-0">' +
          '<div class="text-xs font-semibold text-muted-foreground uppercase mb-2">รูปโปรไฟล์</div>' +
          '<div class="w-32 h-32 md:w-40 md:h-40 mx-auto md:mx-0">' +
            '<div data-pf-avatar class="w-full h-full rounded-full overflow-hidden border border-border bg-primary/10 flex items-center justify-center text-2xl font-semibold text-primary"></div>' +
          '</div>' +
          '<div data-pf-avatar-edit class="hidden mt-3 flex flex-col gap-2 items-center md:items-stretch">' +
            '<button type="button" data-pf-avatar-upload aria-controls="pf-avatar-input" class="border border-border text-card-foreground hover:bg-secondary rounded-lg px-3 py-1.5 text-xs flex items-center justify-center gap-1.5">' +
              '<i data-lucide="upload" class="w-3.5 h-3.5"></i> อัปโหลดรูปใหม่…</button>' +
            '<button type="button" data-pf-avatar-remove class="hidden border border-destructive text-destructive hover:bg-destructive/10 rounded-lg px-3 py-1.5 text-xs flex items-center justify-center gap-1.5">' +
              '<i data-lucide="trash-2" class="w-3.5 h-3.5"></i> ลบรูป</button>' +
          '</div>' +
          '<input type="file" id="pf-avatar-input" data-pf-avatar-input accept="image/*" aria-label="เลือกรูปโปรไฟล์" class="hidden">' +
        '</div>' +
      '</div>';

    var pfView = container.querySelector('[data-pf-view]');
    var pfForm = container.querySelector('[data-pf-form]');
    var btnEdit = container.querySelector('[data-pf-edit]');
    var btnCancel = container.querySelector('[data-pf-cancel]');
    var errBox = container.querySelector('[data-pf-error]');

    var avatarBox = container.querySelector('[data-pf-avatar]');
    var avatarEditWrap = container.querySelector('[data-pf-avatar-edit]');
    var avatarInput = container.querySelector('[data-pf-avatar-input]');
    var btnAvatarUpload = container.querySelector('[data-pf-avatar-upload]');
    var btnAvatarRemove = container.querySelector('[data-pf-avatar-remove]');

    // ค่ารูปที่ยังไม่ได้บันทึก (undefined = ยังไม่แก้, '' = ลบ, dataURL = รูปใหม่)
    // ถูกทิ้งไปเมื่อกด "ยกเลิก" — บันทึกจริงเฉพาะตอนกด "บันทึกการเปลี่ยนแปลง"
    var pendingAvatar;
    var editing = false;

    function fieldRow(label, value) {
      return '<div class="text-muted-foreground">' + esc(label) + '</div>' +
        '<div class="text-card-foreground font-medium">' + (value ? esc(value) : '<span class="text-muted-foreground">—</span>') + '</div>';
    }

    function renderParentView() {
      var p = ParentStore.getParent();
      var fullName = (p.prefix || '') + (p.firstName || '') + ' ' + (p.lastName || '');
      pfView.innerHTML =
        fieldRow('ชื่อ-นามสกุล', fullName.trim()) +
        fieldRow('ความสัมพันธ์', p.relation) +
        fieldRow('เบอร์โทร', p.phone) +
        fieldRow('อีเมล', p.email) +
        fieldRow('LINE ID', p.lineId) +
        fieldRow('อาชีพ', p.occupation) +
        '<div class="md:col-span-2 text-muted-foreground">ที่อยู่</div>' +
        '<div class="md:col-span-2 text-card-foreground font-medium">' + (p.address ? esc(p.address) : '<span class="text-muted-foreground">—</span>') + '</div>';
    }

    function fillParentForm() {
      var p = ParentStore.getParent();
      container.querySelector('[data-pf-prefix]').value = p.prefix || 'นาย';
      container.querySelector('[data-pf-firstName]').value = p.firstName || '';
      container.querySelector('[data-pf-lastName]').value = p.lastName || '';
      container.querySelector('[data-pf-relation]').value = p.relation || 'ผู้ปกครอง';
      container.querySelector('[data-pf-phone]').value = p.phone || '';
      container.querySelector('[data-pf-email]').value = p.email || '';
      container.querySelector('[data-pf-lineId]').value = p.lineId || '';
      container.querySelector('[data-pf-occupation]').value = p.occupation || '';
      container.querySelector('[data-pf-address]').value = p.address || '';
    }

    // ค่ารูปปัจจุบันที่ควรแสดง (รวม pending ที่ยังไม่บันทึกด้วย)
    function currentAvatarValue() {
      return pendingAvatar !== undefined ? pendingAvatar : (ParentStore.getParent().avatar || '');
    }

    function renderAvatarBox() {
      var val = currentAvatarValue();
      var p = ParentStore.getParent();
      if (val) {
        avatarBox.innerHTML = '<img src="' + esc(val) + '" alt="" class="w-full h-full object-cover">';
      } else {
        avatarBox.textContent = ParentUI.initials(p.firstName);
      }
      btnAvatarRemove.classList.toggle('hidden', !val);
    }

    function refreshNavbarAvatar() {
      var p = ParentStore.getParent();
      document.querySelectorAll('[data-dropdown-toggle="user"]').forEach(function (btn) {
        btn.innerHTML = p.avatar
          ? '<img src="' + esc(p.avatar) + '" alt="" class="w-full h-full object-cover">'
          : esc(ParentUI.initials(p.firstName));
      });
    }

    function enterEditMode() {
      editing = true;
      pendingAvatar = undefined;
      fillParentForm();
      errBox.classList.add('hidden');
      pfView.classList.add('hidden');
      btnEdit.classList.add('hidden');
      pfForm.classList.remove('hidden');
      avatarEditWrap.classList.remove('hidden');
      renderAvatarBox();
      container.querySelector('[data-pf-firstName]').focus();
    }

    function exitEditMode() {
      editing = false;
      pendingAvatar = undefined;
      pfForm.classList.add('hidden');
      pfView.classList.remove('hidden');
      btnEdit.classList.remove('hidden');
      avatarEditWrap.classList.add('hidden');
      renderAvatarBox();
    }

    btnEdit.addEventListener('click', enterEditMode);
    btnCancel.addEventListener('click', exitEditMode);

    pfForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstName = container.querySelector('[data-pf-firstName]').value.trim();
      var lastName = container.querySelector('[data-pf-lastName]').value.trim();

      if (!firstName || !lastName) {
        errBox.textContent = 'กรุณากรอกชื่อและนามสกุล';
        errBox.classList.remove('hidden');
        return;
      }
      errBox.classList.add('hidden');

      var patch = {
        prefix: container.querySelector('[data-pf-prefix]').value,
        firstName: firstName,
        lastName: lastName,
        relation: container.querySelector('[data-pf-relation]').value,
        phone: container.querySelector('[data-pf-phone]').value.trim(),
        email: container.querySelector('[data-pf-email]').value.trim(),
        lineId: container.querySelector('[data-pf-lineId]').value.trim(),
        occupation: container.querySelector('[data-pf-occupation]').value.trim(),
        address: container.querySelector('[data-pf-address]').value.trim()
      };
      if (pendingAvatar !== undefined) patch.avatar = pendingAvatar;

      try {
        ParentStore.saveParent(patch);
        ParentUI.toast('บันทึกข้อมูลสำเร็จ', 'success');
      } catch (err) {
        ParentUI.toast('บันทึกรูปไม่สำเร็จ (พื้นที่จัดเก็บเต็ม)', 'error');
      }
      renderParentView();
      refreshNavbarAvatar();
      exitEditMode();
    });

    btnAvatarUpload.addEventListener('click', function () { avatarInput.click(); });

    btnAvatarRemove.addEventListener('click', function () {
      pendingAvatar = '';
      renderAvatarBox();
    });

    avatarInput.addEventListener('change', function () {
      var file = avatarInput.files && avatarInput.files[0];
      avatarInput.value = '';
      if (!file) return;

      if (file.type.indexOf('image/') !== 0) {
        ParentUI.toast('กรุณาเลือกไฟล์รูปภาพ', 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        ParentUI.toast('ไฟล์รูปภาพต้องมีขนาดไม่เกิน 5MB', 'error');
        return;
      }

      var reader = new FileReader();
      reader.onload = function (e) {
        var img = new Image();
        img.onload = function () {
          var size = Math.min(img.width, img.height);
          var sx = (img.width - size) / 2;
          var sy = (img.height - size) / 2;
          var canvas = document.createElement('canvas');
          canvas.width = 256;
          canvas.height = 256;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, sx, sy, size, size, 0, 0, 256, 256);
          pendingAvatar = canvas.toDataURL('image/jpeg', 0.85);
          renderAvatarBox();
        };
        img.onerror = function () { ParentUI.toast('ไม่สามารถอ่านไฟล์รูปภาพนี้ได้', 'error'); };
        img.src = e.target.result;
      };
      reader.onerror = function () { ParentUI.toast('ไม่สามารถอ่านไฟล์นี้ได้', 'error'); };
      reader.readAsDataURL(file);
    });

    renderParentView();
    renderAvatarBox();
    if (window.lucide) lucide.createIcons();
  }

  return { mount: mount };
})();
