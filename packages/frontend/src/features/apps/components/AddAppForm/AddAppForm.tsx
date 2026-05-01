import s from './AddAppForm.module.css';
import common from '../../../../shared/styles/common.module.css';
import { useAddAppForm } from './useAddAppForm';

export function AddAppForm() {
  const { name, setName, playUrl, setPlayUrl, error, handleSubmit, isMutationPending } =
    useAddAppForm();

  return (
    <form onSubmit={handleSubmit} className={`${common.card} ${s.form}`}>
      <h2 className={s.title}>Add App</h2>
      <input
        className={common.input}
        placeholder="App name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        className={common.input}
        placeholder="https://play.google.com/store/apps/details?id=com.example.app"
        value={playUrl}
        onChange={(e) => setPlayUrl(e.target.value)}
        required
      />
      {error && <div className={common.errorText}>{error}</div>}
      <button type="submit" disabled={isMutationPending} className={s.submitBtn}>
        {isMutationPending ? 'Adding...' : 'Add App'}
      </button>
    </form>
  );
}
