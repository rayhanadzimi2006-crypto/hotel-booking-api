export default function DataTable({ columns, data, onEdit, onDelete, loading, renderActions }) {
  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>No</th>
            {columns.map((col) => (
              <th key={col.key} style={styles.th}>
                {col.label}
              </th>
            ))}
            <th style={styles.th}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 2} style={styles.empty}>
                Tidak ada data
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={item.id} style={styles.tr}>
                <td style={styles.td}>{index + 1}</td>
                {columns.map((col) => (
                  <td key={col.key} style={styles.td}>
                    {col.render ? col.render(item[col.key], item) : item[col.key]}
                  </td>
                ))}
                <td style={styles.td}>
                  {renderActions ? renderActions(item) : (
                    <div style={styles.actionBtns}>
                      <button onClick={() => onEdit(item)} style={styles.editBtn}>
                        ✏️ Edit
                      </button>
                      <button onClick={() => onDelete(item)} style={styles.deleteBtn}>
                        🗑️ Hapus
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#7f8c8d',
    fontSize: '16px',
  },
  tableWrapper: {
    overflowX: 'auto',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  th: {
    backgroundColor: '#f8f9fa',
    padding: '14px 16px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#2c3e50',
    borderBottom: '2px solid #e0e0e0',
    whiteSpace: 'nowrap',
  },
  tr: {
    borderBottom: '1px solid #f0f0f0',
    transition: 'background-color 0.2s',
  },
  td: {
    padding: '12px 16px',
    color: '#555',
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#7f8c8d',
  },
  actionBtns: {
    display: 'flex',
    gap: '8px',
  },
  editBtn: {
    padding: '6px 12px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  deleteBtn: {
    padding: '6px 12px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
  },
};