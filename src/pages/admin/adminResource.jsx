import { useEffect, useState } from 'react'
import axios from 'axios'
import Paginator from '../../components/others/Paginator'

const API_URL = 'http://127.0.0.1:8000/api'

function readCollection(response) {
  const collection = response.data?.data ?? response.data

  if (!Array.isArray(collection)) {
    throw new TypeError('Expected the API response to contain a collection.')
  }

  return collection
}

function readPath(object, path) {
  return path.split('.').reduce((value, part) => value?.[part], object)
}

function AdminResource({
  title,
  endpoint,
  idField,
  fields,
  columns,
  canCreate = true,
  note
}) {
  const [items, setItems] = useState([])
  const [options, setOptions] = useState({})
  const [loadingOptions, setLoadingOptions] = useState(false)
  const [form, setForm] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const token = localStorage.getItem('access_token')
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const requiredOptionsUnavailable = fields.some(
    (field) => field.required && field.optionsEndpoint && !options[field.optionsEndpoint]?.length
  )

  const loadItems = async (requestedPage = page) => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get(`${API_URL}/${endpoint}`, {
        ...config,
        params: { page: requestedPage }
      })
      setItems(readCollection(response))
      setPage(response.data?.meta?.current_page ?? response.data?.current_page ?? requestedPage)
      setLastPage(response.data?.meta?.last_page ?? response.data?.last_page ?? 1)
    } catch (requestError) {
      console.error(requestError)
      setError(requestError.response?.data?.message || `ไม่สามารถโหลด${title}ได้`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems(1)
    const optionEndpoints = [...new Set(fields.map((field) => field.optionsEndpoint).filter(Boolean))]
    if (optionEndpoints.length > 0) {
      setLoadingOptions(true)
      Promise.all(optionEndpoints.map(async (optionEndpoint) => {
        const response = await axios.get(`${API_URL}/${optionEndpoint}`, config)
        return [optionEndpoint, readCollection(response)]
      })).then((loadedOptions) => {
        setOptions(Object.fromEntries(loadedOptions))
      }).catch((requestError) => {
        console.error(requestError)
        setError('ไม่สามารถโหลดข้อมูลตัวเลือกสำหรับฟอร์มได้')
      }).finally(() => {
        setLoadingOptions(false)
      })
    }
  }, [endpoint])

  const startEdit = (item) => {
    const values = Object.fromEntries(fields.map(({ name }) => [name, item[name] ?? '']))

    fields.forEach((field) => {
      if (!field.optionsEndpoint || !field.relatedName || values[field.name]) {
        return
      }
      const relatedValue = readPath(item, field.relatedName)
      const matchingOption = (options[field.optionsEndpoint] || []).find(
        (option) => option[field.optionLabel] === relatedValue
      )
      if (matchingOption) {
        values[field.name] = matchingOption[field.optionId]
      }
    })

    setForm(values)
    setEditingId(item[idField])
    setMessage('')
    setError('')
  }

  const resetForm = () => {
    setForm({})
    setEditingId(null)
  }

  const saveItem = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    const editableFields = fields.filter((field) => field.editable !== false)
    const hasFiles = editableFields.some((field) => field.type === 'file')
    const payload = hasFiles
      ? new FormData()
      : Object.fromEntries(
        editableFields
          .filter((field) => field.type !== 'file')
          .map((field) => [field.name, form[field.name] ?? ''])
      )

    if (hasFiles) {
      editableFields.forEach((field) => {
        const value = form[field.name]
        if (field.type !== 'file' || value instanceof File) {
          payload.append(field.name, value ?? '')
        }
      })
    }

    try {
      if (editingId === '') {
        await axios.post(`${API_URL}/${endpoint}`, payload, config)
        setMessage(`${title}เพิ่มเรียบร้อยแล้ว`)
      } else if (hasFiles) {
        payload.append('_method', 'PUT')
        await axios.post(`${API_URL}/${endpoint}/${editingId}`, payload, config)
        setMessage(`บันทึกการแก้ไข${title}แล้ว`)
      } else {
        await axios.put(`${API_URL}/${endpoint}/${editingId}`, payload, config)
        setMessage(`บันทึกการแก้ไข${title}แล้ว`)
      }
      resetForm()
      await loadItems(page)
    } catch (requestError) {
      console.error(requestError)
      const validationErrors = requestError.response?.data?.errors
      setError(
        validationErrors
          ? Object.values(validationErrors).flat().join(' ')
          : requestError.response?.data?.message || `ไม่สามารถบันทึก${title}ได้`
      )
    } finally {
      setSaving(false)
    }
  }

  const deleteItem = async (item) => {
    if (!window.confirm(`ยืนยันการลบ${title}รายการนี้หรือไม่?`)) {
      return
    }

    try {
      setError('')
      await axios.delete(`${API_URL}/${endpoint}/${item[idField]}`, config)
      setMessage(`ลบ${title}เรียบร้อยแล้ว`)
      await loadItems(page)
    } catch (requestError) {
      console.error(requestError)
      setError(requestError.response?.data?.message || `ไม่สามารถลบ${title}ได้`)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {canCreate && editingId === null && (
          <button
            type="button"
            disabled={loadingOptions || requiredOptionsUnavailable}
            onClick={() => {
              setForm({})
              setEditingId('')
              setError('')
              setMessage('')
            }}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            เพิ่ม{title}
          </button>
        )}
      </div>

      {note && <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{note}</p>}
      {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {message && <p role="status" className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p>}

      {editingId !== null && (
        <form onSubmit={saveItem} className="mt-6 grid gap-4 rounded-xl bg-white p-5 shadow-sm md:grid-cols-2">
          {fields.filter((field) => field.editable !== false).map((field) => (
            <label key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
              <span className="mb-1 block text-sm font-medium text-gray-700">{field.label}</span>
              {field.type === 'textarea' ? (
                <textarea
                  required={field.required}
                  value={form[field.name] ?? ''}
                  onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
                  rows="4"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              ) : field.type === 'file' ? (
                <input
                  type="file"
                  accept={field.accept || 'image/*'}
                  required={field.required && editingId === ''}
                  onChange={(event) => setForm({
                    ...form,
                    [field.name]: event.target.files?.[0] || null
                  })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
                />
              ) : field.type === 'select' ? (
                <select
                  required={field.required}
                  value={form[field.name] ?? ''}
                  onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
                >
                  <option value="">เลือก{field.label}</option>
                  {field.options ? field.options.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  )) : (options[field.optionsEndpoint] || []).map((option) => (
                    <option key={option[field.optionId]} value={option[field.optionId]}>
                      {option[field.optionLabel]}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || 'text'}
                  required={field.required}
                  min={field.min}
                  max={field.max}
                  value={form[field.name] ?? ''}
                  onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              )}
            </label>
          ))}
          <div className="flex gap-3 md:col-span-2">
            <button disabled={saving} className="rounded-lg bg-blue-600 px-5 py-2 text-white disabled:opacity-60">
              {saving ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
            <button type="button" onClick={resetForm} className="rounded-lg border px-5 py-2 text-gray-700">
              ยกเลิก
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl bg-white shadow-sm">
        {loading ? (
          <p className="p-8 text-center text-gray-500">กำลังโหลดข้อมูล...</p>
        ) : items.length === 0 ? (
          <p className="p-8 text-center text-gray-500">ไม่พบข้อมูล</p>
        ) : (
          <table className="w-full min-w-max text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                {columns.map((column) => <th key={column.label} className="px-4 py-3 font-semibold">{column.label}</th>)}
                <th className="px-4 py-3 font-semibold">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item[idField]}>
                  {columns.map((column) => (
                    <td key={column.label} className="max-w-xs px-4 py-3 text-gray-700">
                      {column.type === 'image' && readPath(item, column.path) ? (
                        <img
                          src={new URL(readPath(item, column.path), 'http://127.0.0.1:8000/').toString()}
                          alt={column.label}
                          className="h-12 w-12 rounded object-cover"
                        />
                      ) : String(readPath(item, column.path) ?? '-')}
                    </td>
                  ))}
                  <td className="whitespace-nowrap px-4 py-3">
                    <button
                      disabled={loadingOptions || requiredOptionsUnavailable}
                      onClick={() => startEdit(item)}
                      className="mr-3 text-blue-600 hover:underline disabled:opacity-50"
                    >
                      แก้ไข
                    </button>
                    <button onClick={() => deleteItem(item)} className="text-red-600 hover:underline">ลบ</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Paginator page={page} totalPages={lastPage} onPageChange={loadItems} disabled={loading} />
    </div>
  )
}

export default AdminResource
