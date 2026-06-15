import React, { useState, useEffect } from 'react';

export default function PetForm({ currentUser, onPetAdded, onCancel, petToEdit = null }) {
  const [step, setStep] = useState(1);
  
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('DOG');
  const [breed, setBreed] = useState('');
  const [weight, setWeight] = useState('');
  const [image, setImage] = useState('');
  const [gender, setGender] = useState('MALE');
  const [description, setDescription] = useState('');

  // Nếu truyền petToEdit vào, tức là đang ở chế độ Sửa (Edit)
  useEffect(() => {
    if (petToEdit) {
      setName(petToEdit.name || '');
      setSpecies(petToEdit.species || 'DOG');
      setBreed(petToEdit.breed || '');
      setWeight(petToEdit.weight || '');
      setImage(petToEdit.image || '');
      setGender(petToEdit.gender || 'MALE');
      setDescription(petToEdit.description || '');
      // Bỏ qua wizard nếu đang sửa
      setStep(3); 
    }
  }, [petToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !breed || !weight) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    let allPets = JSON.parse(localStorage.getItem('spa_pets') || '[]');
    
    // VALIDATION: Kiểm tra thú cưng đã tồn tại chưa (Duplicate Check - Activity Diagram)
    if (!petToEdit) {
      const isDuplicate = allPets.some(p => 
        p.ownerId === currentUser.id && 
        p.name.toLowerCase() === name.toLowerCase() && 
        p.species === species
      );
      
      if (isDuplicate) {
        alert(`Bạn đã có một bé ${species === 'DOG' ? 'Chó' : 'Mèo'} tên là "${name}" rồi! Vui lòng kiểm tra lại.`);
        return; // Dừng lại ở form
      }
    }
    
    if (petToEdit) {
      // Chế độ Sửa (Update)
      allPets = allPets.map(p => {
        if (p.id === petToEdit.id) {
          return { ...p, name, species, breed, weight: parseFloat(weight), image, gender, description };
        }
        return p;
      });
      localStorage.setItem('spa_pets', JSON.stringify(allPets));
      onPetAdded(); // Gọi lại loadData
    } else {
      // Chế độ Thêm mới (Create)
      const newPet = {
        id: Date.now().toString(),
        ownerId: currentUser.id,
        name,
        species,
        breed,
        weight: parseFloat(weight),
        image: image || (species === 'DOG' ? 'https://cdn-icons-png.flaticon.com/512/616/616408.png' : 'https://cdn-icons-png.flaticon.com/512/616/616430.png'),
        gender,
        description,
        createdAt: new Date().toISOString()
      };
      allPets.push(newPet);
      localStorage.setItem('spa_pets', JSON.stringify(allPets));
      onPetAdded(); // Gọi lại loadData
    }
  };

  const handleDelete = () => {
    if (confirm("Bạn có chắc chắn muốn xóa hồ sơ của bé không?")) {
      let allPets = JSON.parse(localStorage.getItem('spa_pets') || '[]');
      allPets = allPets.filter(p => p.id !== petToEdit.id);
      localStorage.setItem('spa_pets', JSON.stringify(allPets));
      onPetAdded();
    }
  };

  return (
    <div className="card fade-in" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>{petToEdit ? 'Chỉnh Sửa Hồ Sơ Thú Cưng' : 'Tạo Profile Thú Cưng'}</h3>
        {!petToEdit && (
          <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary)', background: 'var(--primary-light)', padding: '0.25rem 0.75rem', borderRadius: '1rem' }}>
            Bước {step}/3
          </div>
        )}
      </div>

      {/* BƯỚC 1: Chọn Loại Thú Cưng */}
      {step === 1 && !petToEdit && (
        <div className="fade-in" style={{ textAlign: 'center', padding: '1rem 0' }}>
          <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Vui lòng chọn loại thú cưng</h4>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
            <div 
              style={{ padding: '2rem', border: '2px solid var(--border-color)', borderRadius: '1rem', cursor: 'pointer', transition: 'all 0.2s', width: '150px' }}
              onClick={() => { setSpecies('DOG'); setStep(2); }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="Dog" style={{ width: '80px', marginBottom: '1rem' }} />
              <h3 style={{ margin: 0 }}>Chó</h3>
            </div>
            <div 
              style={{ padding: '2rem', border: '2px solid var(--border-color)', borderRadius: '1rem', cursor: 'pointer', transition: 'all 0.2s', width: '150px' }}
              onClick={() => { setSpecies('CAT'); setStep(2); }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <img src="https://cdn-icons-png.flaticon.com/512/616/616430.png" alt="Cat" style={{ width: '80px', marginBottom: '1rem' }} />
              <h3 style={{ margin: 0 }}>Mèo</h3>
            </div>
          </div>
          <button type="button" className="btn-outline" style={{ marginTop: '2rem', width: '100px' }} onClick={onCancel}>Hủy bỏ</button>
        </div>
      )}

      {/* BƯỚC 2: Chọn Giống */}
      {step === 2 && !petToEdit && (
        <div className="fade-in">
          <h4 style={{ marginBottom: '1rem' }}>Giống {species === 'DOG' ? 'Chó' : 'Mèo'} của bạn là gì?</h4>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Nhập giống (Breed) (*)</label>
            <input type="text" className="input-field" placeholder={species === 'DOG' ? 'Ví dụ: Poodle, Corgi, Husky...' : 'Ví dụ: Anh Lông Ngắn, Ba Tư...'} value={breed} onChange={e => setBreed(e.target.value)} required autoFocus />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setStep(1)}>Quay lại</button>
            <button type="button" className="btn-primary" style={{ flex: 1 }} onClick={() => {
              if(!breed) return alert("Vui lòng nhập giống thú cưng!");
              setStep(3);
            }}>Tiếp tục</button>
          </div>
        </div>
      )}

      {/* BƯỚC 3: Thông tin cơ bản */}
      {(step === 3 || petToEdit) && (
        <form onSubmit={handleSubmit} className="fade-in">
          
          <h4 style={{ margin: '0 0 1rem 0' }}>Nhập thông tin cơ bản</h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Tên thú cưng (*)</label>
              <input type="text" className="input-field" placeholder="Ví dụ: Lulu" value={name} onChange={e => setName(e.target.value)} required autoFocus />
            </div>
            <div>
              <label style={{ fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Giới tính</label>
              <select className="input-field" value={gender} onChange={e => setGender(e.target.value)}>
                <option value="MALE">Đực</option>
                <option value="FEMALE">Cái</option>
              </select>
            </div>
          </div>
          
          <div className="responsive-grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Cân nặng (kg) (*)</label>
              <input type="number" step="0.1" className="input-field" placeholder="Ví dụ: 4.5" value={weight} onChange={e => setWeight(e.target.value)} required />
            </div>
            {petToEdit && (
               <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Giống (Breed) (*)</label>
                  <input type="text" className="input-field" placeholder="Ví dụ: Poodle" value={breed} onChange={e => setBreed(e.target.value)} required />
               </div>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Mô tả thêm về bé</label>
            <textarea className="input-field" rows="2" placeholder="Ví dụ: Bé nhát người lạ, hay bị ngứa tai..." value={description} onChange={e => setDescription(e.target.value)}></textarea>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Ảnh thú cưng (Link URL)</label>
            <input type="url" className="input-field" placeholder="https://..." value={image} onChange={e => setImage(e.target.value)} />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>Có thể bỏ trống để dùng ảnh mặc định.</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            {!petToEdit && <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setStep(2)}>Quay lại</button>}
            {petToEdit && <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={onCancel}>Hủy bỏ</button>}
            
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>{petToEdit ? 'Cập Nhật Hồ Sơ' : 'Ghi nhận thông tin'}</button>
            
            {petToEdit && (
              <button type="button" className="btn-outline" style={{ flex: 1, borderColor: '#ef4444', color: '#ef4444' }} onClick={handleDelete}>Xóa Hồ Sơ</button>
            )}
          </div>
        </form>
      )}

    </div>
  );
}
