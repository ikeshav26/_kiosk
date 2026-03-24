import { useState } from 'react';
import { Phone, UserCheck } from 'lucide-react';

interface AdminMember {
  name: string;
  designation: string;
  phoneNumber: string;
  imageUrl: string;
}

const DUMMY_MEMBERS: AdminMember[] = [
  {
    name: 'Dr. Gurmeet Singh Dhaliwal',
    designation: 'Chairman',
    phoneNumber: '-',
    imageUrl: 'http://www.bfcet.com/wp-content/uploads/2025/02/Dr.-Gurmeet-Singh-Dhaliwal.png',
  },
  {
    name: 'Prof (Dr.) MP Poonia',
    designation: 'Campus Director',
    phoneNumber: '98155-75260',
    imageUrl: 'http://www.bfcet.com/wp-content/uploads/2025/02/puniasir.png',
  },
  {
    name: 'Prof (Dr.) Jayoti Bansal',
    designation: 'Principal, BFCET',
    phoneNumber: '95011-15405',
    imageUrl: 'http://www.bfcet.com/wp-content/uploads/2021/08/Dr-Jyoti-Bansal.jpg',
  },
  {
    name: 'Mr. Rajinder Singh Dhanoa',
    designation: 'Assistant Director',
    phoneNumber: '95011-15021',
    imageUrl: 'https://www.bfcet.com/wp-content/smush-webp/2025/02/dhanoa-282x300.jpg.webp',
  },
  {
    name: 'Dr. Manish Gupta',
    designation: 'Head, Incubation Centre',
    phoneNumber: '95011-15418',
    imageUrl: 'http://www.bfcet.com/wp-content/uploads/2021/08/Dr-Manish-Gupta.jpg',
  },
  {
    name: 'Dr. Nimisha Singh',
    designation: 'Head, School of Skill Development',
    phoneNumber: '95011-15422',
    imageUrl:
      'https://www.bfcet.com/wp-content/uploads/2025/07/Nimisha-Singh_School-of-Skill-development-e1752730746553-282x300.jpeg',
  },
  {
    name: 'Dr. Tejinderpal Singh Sarao',
    designation: 'IQAC Coordinator',
    phoneNumber: '95011-15438',
    imageUrl: 'http://www.bfcet.com/wp-content/uploads/2025/02/tajinder-270x300.jpg',
  },
  {
    name: 'Mr. Hardeep Singh',
    designation: 'Dean Student Welfare',
    phoneNumber: '95011-15485',
    imageUrl: 'https://www.bfcet.com/wp-content/uploads/2025/02/hardeep-287x300.jpg',
  },
  {
    name: 'Mr. Krishan Thakhur',
    designation: 'Finance Officer',
    phoneNumber: '95011-15034',
    imageUrl: 'https://www.bfcet.com/wp-content/uploads/2025/02/krishan.jpg',
  },
];
const Administration = () => {
  const [members] = useState<AdminMember[]>(DUMMY_MEMBERS);

  return (
    <div className="flex flex-col h-full bg-[#fcfdfe] rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 font-sans relative">
      <div className="p-12 pb-8 bg-white border-b border-slate-50 shrink-0 z-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#002b5c]">
                <UserCheck size={16} />
              </div>
              <span className="text-[#002b5c] font-bold text-xs uppercase tracking-widest opacity-80">
                Directory
              </span>
            </div>
            <h2 className="text-5xl font-black text-[#002b5c] tracking-tighter italic">
              Administration
            </h2>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-slate-50/20">
        {members.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {members.map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 hover:shadow-xl hover:border-[#002b5c]/20 transition-all duration-300 group"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 bg-slate-50 shadow-sm mb-6 group-hover:scale-105 transition-transform duration-500">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://ui-avatars.com/api/?name=${member.name}&background=002b5c&color=fff&size=256`;
                    }}
                  />
                </div>
                <div className="w-full flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-[#002b5c] truncate mb-2">{member.name}</h3>
                  <p className="text-xs font-bold text-[#002b5c]/70 uppercase tracking-[0.15em] mb-6 line-clamp-2 min-h-8">
                    {member.designation}
                  </p>

                  <div className="mt-auto">
                    <div className="w-12 h-1 bg-slate-100 mx-auto rounded-full mb-6 transition-colors group-hover:bg-[#002b5c]/10" />

                    <div className="inline-flex items-center gap-3 px-5 py-3 bg-slate-50 rounded-2xl group-hover:bg-[#002b5c] group-hover:text-white transition-colors duration-300 text-slate-600">
                      <Phone size={18} />
                      <span className="text-[15px] font-semibold tracking-wide">
                        {member.phoneNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-30 text-slate-400 grayscale py-32">
            <div className="p-12 bg-white rounded-full shadow-inner mb-8">
              <UserCheck size={120} strokeWidth={0.5} />
            </div>
            <h3 className="text-4xl font-black uppercase tracking-[0.2em] text-[#002b5c]">
              No Records
            </h3>
            <p className="text-xl mt-4 font-medium">Administrative directory is currently clear</p>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #e2e8f0; 
          border-radius: 20px; 
          border: 2px solid #fcfdfe;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Administration;
