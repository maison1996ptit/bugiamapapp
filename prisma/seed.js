require('dotenv').config()
const { Pool } = require('pg')
const { PrismaPg } = require('@prisma/adapter-pg')
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  console.log('Đang khởi tạo tài khoản...')
  
  // Tạo tài khoản Admin mẫu
  await prisma.user.upsert({
    where: { email: 'admin@mps.gov.vn' },
    update: {},
    create: {
      email: 'admin@mps.gov.vn',
      name: 'Quản trị viên hệ thống',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // Tạo tài khoản Cán bộ mẫu
  await prisma.user.upsert({
    where: { email: 'officer@mps.gov.vn' },
    update: {},
    create: {
      email: 'officer@mps.gov.vn',
      name: 'Cán bộ Nguyễn Văn A',
      password: hashedPassword,
      role: 'OFFICER',
      department: 'Phòng CSGT',
    },
  })

  console.log('Đang khởi tạo phản ánh mẫu...')

  // Sử dụng upsert cho report để tránh lỗi Unique constraint khi chạy lại seed
  await prisma.report.upsert({
    where: { lookupCode: 'GT123456' },
    update: {},
    create: {
      lookupCode: 'GT123456',
      title: 'Lấn chiếm lòng lề đường',
      description: 'Nhiều hộ kinh doanh bày bán hàng hóa tràn ra đường gây cản trở giao thông.',
      category: 'traffic',
      latitude: 21.0285,
      longitude: 105.8542,
      status: 'PENDING',
    }
  })

  // --- NEWS SEED ---
  await prisma.news.createMany({
    data: [
      {
        title: 'Bù Gia Mập: Tăng cường tuần tra, đảm bảo an ninh trật tự dịp lễ',
        content: 'Công an xã Bù Gia Mập phối hợp cùng các lực lượng chức năng triển khai kế hoạch tuần tra 24/7 nhằm đảm bảo an ninh trật tự, an toàn giao thông trên các tuyến đường trọng điểm...',
        category: 'Tin an ninh',
        imageUrl: 'https://images.unsplash.com/photo-1593115057322-e94b77572f20?q=80&w=2071&auto=format&fit=crop',
      },
      {
        title: 'Cảnh báo thủ đoạn lừa đảo chiếm đoạt tài sản qua mạng xã hội',
        content: 'Thời gian gần đây, trên địa bàn xuất hiện nhiều trường hợp đối tượng sử dụng mạng xã hội để giả danh cán bộ công an, viện kiểm sát nhằm lừa đảo chiếm đoạt tài sản của người dân...',
        category: 'Cảnh báo',
        imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
      },
      {
        title: 'Hướng dẫn quy trình đăng ký tạm trú, tạm vắng trực tuyến',
        content: 'Để tạo điều kiện thuận lợi cho người dân, Công an xã Bù Gia Mập hướng dẫn các bước thực hiện đăng ký tạm trú, tạm vắng thông qua Cổng dịch vụ công quốc gia...',
        category: 'Hướng dẫn',
        imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop',
      }
    ]
  })

  // --- DOCUMENTS SEED ---
  await prisma.document.createMany({
    data: [
      {
        title: 'Mẫu đơn trình báo mất tài sản',
        fileName: 'mau_don_trinh_bao_mat_tai_san.pdf',
        fileUrl: '/documents/mau_don_trinh_bao_mat_tai_san.pdf',
      },
      {
        title: 'Quy trình tiếp nhận và xử lý phản ánh',
        fileName: 'quy_trinh_tiep_nhan_xu_ly.pdf',
        fileUrl: '/documents/quy_trinh_tiep_nhan_xu_ly.pdf',
      },
      {
        title: 'Hướng dẫn an toàn phòng cháy chữa cháy',
        fileName: 'huong_dan_pccc.pdf',
        fileUrl: '/documents/huong_dan_pccc.pdf',
      }
    ]
  })

  console.log('Đã khởi tạo dữ liệu mẫu thành công!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
