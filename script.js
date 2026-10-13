const form = document.getElementById('symptom-form');
const guidance = document.getElementById('guidance');
const noneOption = form.querySelector('input[value="none"]');
const symptomOptions = [...form.querySelectorAll('input[name="symptom"]')].filter(x => x.value !== 'none');

noneOption.addEventListener('change', () => {
  if (noneOption.checked) symptomOptions.forEach(option => option.checked = false);
});
symptomOptions.forEach(option => option.addEventListener('change', () => {
  if (option.checked) noneOption.checked = false;
}));

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const selected = [...form.querySelectorAll('input[name="symptom"]:checked')];
  const concerning = selected.some(item => item.value !== 'none');

  guidance.hidden = false;
  if (concerning) {
    guidance.innerHTML = `
      <h3>Next step: arrange a medical assessment</h3>
      <p>You selected one or more breast changes. This checklist cannot tell what is causing them, and many breast changes have non-cancer causes. Please contact a qualified healthcare professional or breast clinic promptly to discuss the change. Do not wait for this app to assess it.</p>
      <p><strong>If symptoms are rapidly worsening or you feel acutely unwell, seek urgent medical care.</strong></p>`;
  } else if (noneOption.checked) {
    guidance.innerHTML = `
      <h3>Keep up with breast health</h3>
      <p>You did not select any listed changes. That does not rule out breast cancer. Continue to be aware of what is normal for you and ask a healthcare professional about screening appropriate for your age and personal risk.</p>`;
  } else {
    guidance.innerHTML = `
      <h3>Please choose an option</h3>
      <p>Select any changes you have noticed, or select “I have not noticed any of these changes.” If you are worried about a breast change, contact a healthcare professional even if it is not listed here.</p>`;
  }
  guidance.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

form.addEventListener('reset', () => {
  guidance.hidden = true;
  guidance.textContent = '';
});

const dateInput = document.getElementById('reminder-date');
const noteInput = document.getElementById('reminder-note');
const status = document.getElementById('reminder-status');
const saveButton = document.getElementById('save-reminder');

saveButton.addEventListener('click', () => {
  const date = dateInput.value;
  if (!date) {
    status.textContent = 'Please choose a reminder date first.';
    dateInput.focus();
    return;
  }
  const note = noteInput.value.trim() || 'Review breast health information or contact a clinic';
  try {
    localStorage.setItem('breastHealthReminder', JSON.stringify({ date, note }));
    status.textContent = `Reminder saved on this device for ${date}: ${note}. This app does not send notifications.`;
  } catch (error) {
    status.textContent = 'Your browser could not save this reminder. You can add it to your device calendar instead.';
  }
});

try {
  const saved = JSON.parse(localStorage.getItem('breastHealthReminder') || 'null');
  if (saved) {
    dateInput.value = saved.date || '';
    noteInput.value = saved.note || '';
    status.textContent = `Saved reminder found for ${saved.date}: ${saved.note}. This app does not send notifications.`;
  }
} catch (error) {
  // The app remains usable if local storage is unavailable.
}
