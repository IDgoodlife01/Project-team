import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Image as ImageIcon,
  Plus,
  Trash2,
  Save,
  Info,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../AxiosApi";

// 백엔드 REGIONS 테이블 기준 (region_id)
const REGIONS = [
  { id: 1, name: "서울" },
  { id: 2, name: "부산" },
  { id: 3, name: "대구" },
  { id: 4, name: "인천" },
  { id: 5, name: "광주" },
  { id: 6, name: "대전" },
  { id: 7, name: "울산" },
  { id: 8, name: "경기" },
  { id: 9, name: "강원" },
  { id: 10, name: "충북" },
  { id: 11, name: "충남" },
  { id: 12, name: "전북" },
  { id: 13, name: "전남" },
  { id: 14, name: "경북" },
  { id: 15, name: "경남" },
  { id: 16, name: "제주" },
];

const PET_TYPE_OPTIONS = ["소형견", "중형견", "대형견", "고양이"];

const DEFAULT_FORM = {
  regionId: 1,
  cafeName: "",
  address: "",
  phone: "",
  description: "",
  allowedPetTypes: [], // 배열로 관리 → submit 시 콤마 join
  maxWeight: "",
  latitude: 37.5665,
  longitude: 126.978,
  naverMapUrl: "",
  imageUrls: [],
};

const inputCls =
  "w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/10 focus:border-[#FF6B35] transition-all font-bold placeholder:text-gray-300";

function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-1.5 h-6 bg-[#FF6B35] rounded-full" />
      <h3 className="font-black text-xl text-gray-900">{children}</h3>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-black text-gray-700 ml-1">{label}</label>
      {children}
    </div>
  );
}

export default function CafeRegistration() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isAdmin } = useAuth();

  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [imageInput, setImageInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // 수정 모드: 기존 카페 데이터 로드
  useEffect(() => {
    if (!id) return;
    const loadCafe = async () => {
      try {
        const data = await api.cafes.getById(id);
        // 백엔드 getCafeDetail은 { cafe: CafeVO } 형태로 반환
        const cafe = data.cafe || data;
        if (!isAdmin && String(cafe.userId) !== String(user?.id)) {
          alert("수정 권한이 없습니다.");
          navigate("/search");
          return;
        }
        setFormData({
          regionId: cafe.regionId ?? 1,
          cafeName: cafe.cafeName ?? "",
          address: cafe.address ?? "",
          phone: cafe.phone ?? "",
          description: cafe.description ?? "",
          allowedPetTypes: cafe.allowedPetTypes
            ? cafe.allowedPetTypes.split(",").map((t) => t.trim())
            : [],
          maxWeight: cafe.maxWeight ?? "",
          latitude: cafe.latitude ?? 37.5665,
          longitude: cafe.longitude ?? 126.978,
          naverMapUrl: cafe.naverMapUrl ?? "",
          imageUrls: cafe.imageUrls ?? [],
        });
        setIsEditMode(true);
      } catch (err) {
        console.error("카페 로드 실패:", err);
        alert("카페 정보를 불러오지 못했습니다.");
        navigate("/search");
      }
    };
    loadCafe();
  }, [id, isAdmin, navigate, user]);

  // 네이버 지도 스크립트 로드
  useEffect(() => {
    const scriptId = "naver-maps-script";
    if (document.getElementById(scriptId)) return;
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${
      import.meta.env?.VITE_NAVER_MAPS_CLIENT_ID || "YOUR_CLIENT_ID"
    }&submodules=geocoder`;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePetType = (type) => {
    setFormData((prev) => ({
      ...prev,
      allowedPetTypes: prev.allowedPetTypes.includes(type)
        ? prev.allowedPetTypes.filter((t) => t !== type)
        : [...prev.allowedPetTypes, type],
    }));
  };

  const addImage = () => {
    const url = imageInput.trim();
    if (!url) return;
    setFormData((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, url] }));
    setImageInput("");
  };

  const removeImage = (idx) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== idx),
    }));
  };

  const geocodeAddress = () => {
    if (!formData.address) return;
    const naver = window.naver;
    if (!naver?.maps?.Service?.geocode) {
      alert("지도 서비스 로딩 중입니다. 잠시 후 다시 시도해 주세요.");
      return;
    }
    naver.maps.Service.geocode(
      { query: formData.address },
      (status, response) => {
        if (
          status === naver.maps.Service.Status.OK &&
          response.v2.addresses.length > 0
        ) {
          const item = response.v2.addresses[0];
          setFormData((prev) => ({
            ...prev,
            latitude: parseFloat(item.y),
            longitude: parseFloat(item.x),
          }));
          alert("좌표 변환 성공!");
        } else {
          alert("주소를 찾을 수 없습니다. 상세 주소를 확인해주세요.");
        }
      },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cafeName.trim() || !formData.address.trim()) {
      alert("카페 이름과 주소는 필수입니다.");
      return;
    }
    setIsSubmitting(true);

    // 백엔드 CafeVO 필드에 맞게 변환
    const payload = {
      ...formData,
      allowedPetTypes: formData.allowedPetTypes.join(","),
      maxWeight: formData.maxWeight ? parseFloat(formData.maxWeight) : 0,
    };

    try {
      if (isEditMode && id) {
        await api.cafes.update(id, payload);
        alert("카페 정보가 수정되었습니다.");
        navigate(`/cafe/${id}`);
      } else {
        const result = await api.cafes.create(payload);
        alert("카페가 등록되었습니다.");
        // 백엔드가 "카페 등록 성공" 문자열을 반환하므로 목록으로 이동
        navigate("/search");
      }
    } catch (err) {
      console.error("저장 실패:", err);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-24 px-4 overflow-x-hidden">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">
              우리 동네{" "}
              <span className="text-[#FF6B35]">
                카페 {isEditMode ? "수정" : "등록"}
              </span>
            </h1>
            <p className="text-gray-500 font-bold">
              {isEditMode
                ? "카페 정보를 업데이트해 주세요."
                : "반려견과 함께 가기 좋은 카페를 알려주세요!"}
            </p>
          </motion.div>
        </header>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="bg-[#FF6B35] p-6 text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <span className="font-black text-lg">카페 정보 입력</span>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* 기본 정보 */}
            <section className="space-y-6">
              <SectionTitle>기본 정보</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="카페 이름 *">
                  <input
                    required
                    name="cafeName"
                    value={formData.cafeName}
                    onChange={handleChange}
                    placeholder="카페 이름을 입력하세요"
                    className={inputCls}
                  />
                </Field>
                <Field label="연락처 (선택)">
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="010-0000-0000"
                    className={inputCls}
                  />
                </Field>
              </div>
              <Field label="카페 설명 (선택)">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="카페의 특징이나 반려동물 동반 시 유의사항을 적어주세요"
                  className={`${inputCls} resize-none`}
                />
              </Field>
            </section>

            {/* 위치 */}
            <section className="space-y-6">
              <SectionTitle>위치</SectionTitle>
              <Field label="지역">
                <select
                  name="regionId"
                  value={formData.regionId}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      regionId: Number(e.target.value),
                    }))
                  }
                  className={inputCls}
                >
                  {REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="상세 주소 *">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF6B35] w-5 h-5" />
                    <input
                      required
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="예: 서울특별시 마포구 ..."
                      className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/10 focus:border-[#FF6B35] transition-all font-bold placeholder:text-gray-300"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={geocodeAddress}
                    className="px-6 bg-gray-900 text-white font-black rounded-2xl hover:bg-[#FF6B35] transition-all"
                  >
                    좌표 변환
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 font-bold ml-1 mt-1 italic"></p>
              </Field>
              <Field label="네이버 지도 URL (선택)">
                <input
                  name="naverMapUrl"
                  value={formData.naverMapUrl}
                  onChange={handleChange}
                  placeholder="https://map.naver.com/..."
                  className={inputCls}
                />
              </Field>
            </section>

            {/* 반려동물 조건 */}
            <section className="space-y-6">
              <SectionTitle>반려동물 조건</SectionTitle>
              <div className="space-y-3">
                <label className="text-sm font-black text-gray-700 ml-1">
                  입장 가능 반려동물
                </label>
                <div className="flex flex-wrap gap-2">
                  {PET_TYPE_OPTIONS.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => togglePetType(type)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-black transition-all border",
                        formData.allowedPetTypes.includes(type)
                          ? "bg-[#FF6B35] text-white border-[#FF6B35]"
                          : "bg-white text-gray-400 border-gray-100 hover:border-[#FF6B35]/30",
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <Field label="최대 허용 체중 (kg)">
                <input
                  type="number"
                  name="maxWeight"
                  value={formData.maxWeight}
                  onChange={handleChange}
                  placeholder="예: 15"
                  min="0"
                  step="0.1"
                  className={inputCls}
                />
              </Field>
            </section>

            {/* 이미지 */}
            <section className="space-y-6">
              <SectionTitle>이미지 등록</SectionTitle>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="이미지 URL을 입력하세요"
                    className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/10 focus:border-[#FF6B35] transition-all font-bold placeholder:text-gray-300"
                  />
                </div>
                <button
                  type="button"
                  onClick={addImage}
                  className="p-4 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {formData.imageUrls.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-2xl overflow-hidden group border border-gray-100"
                  >
                    <img
                      src={img}
                      alt={`Preview ${idx}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white rounded-lg text-[10px] font-black">
                      {idx === 0 ? "대표" : `${idx + 1}`}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {formData.imageUrls.length === 0 && (
                  <div className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50 flex flex-col items-center justify-center text-gray-300 gap-2 text-xs">
                    <ImageIcon className="w-8 h-8 opacity-50" />
                    이미지 없음
                  </div>
                )}
              </div>
            </section>

            {/* 제출 */}
            <div className="pt-8 border-t border-gray-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full py-5 rounded-3xl font-black text-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3",
                  isSubmitting
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#FF6B35] text-white hover:bg-[#E85D2A]",
                )}
              >
                {isSubmitting ? (
                  "처리 중..."
                ) : (
                  <>
                    <Save className="w-6 h-6" />
                    카페 {isEditMode ? "수정" : "등록"} 완료하기
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full mt-4 py-4 rounded-2xl font-black text-gray-400 hover:text-gray-600 transition-all"
              >
                취소하고 돌아가기
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
