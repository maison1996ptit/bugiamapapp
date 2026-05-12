import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-[#E0E2E5] py-10 text-[#42474E] mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-[900] text-[12px] text-police-green mb-4 uppercase tracking-[0.8px]">Bộ Công An</h3>
            <p className="text-[13px] leading-relaxed">
              Hệ thống chính thức tiếp nhận và xử lý phản ánh của người dân về an ninh, trật tự và các vấn đề xã hội tại địa bàn xã Bù Gia Mập.
            </p>
          </div>
          <div>
            <h3 className="font-[900] text-[12px] text-police-green mb-4 uppercase tracking-[0.8px]">Liên kết hữu ích</h3>
            <ul className="text-[13px] space-y-2 font-medium">
              <li><a href="#" className="hover:text-national-red transition-colors underline decoration-slate-200 underline-offset-4">Hướng dẫn gửi phản ánh</a></li>
              <li><a href="#" className="hover:text-national-red transition-colors underline decoration-slate-200 underline-offset-4">Quy trình xử lý phản ánh</a></li>
              <li><a href="#" className="hover:text-national-red transition-colors underline decoration-slate-200 underline-offset-4">Chính sách bảo mật thông tin</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-[900] text-[12px] text-police-green mb-4 uppercase tracking-[0.8px]">Thông tin liên hệ</h3>
            <div className="text-[13px] space-y-2">
              <p>Địa chỉ: Trụ sở công an xã Bù Gia Mập tại thôn Bù Lư, xã Bù Gia Mập, tỉnh Đồng Nai</p>
              <p>Điện thoại trực ban: 02173727888</p>
            </div>
          </div>
        </div>
        <div className="border-t border-[#E0E2E5] mt-10 pt-6 text-center">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            © {new Date().getFullYear()} CÔNG AN XÃ BÙ GIA MẬP - BÌNH PHƯỚC
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
