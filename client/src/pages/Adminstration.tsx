import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Phone, UserCheck, X } from 'lucide-react';

interface AdminMember {
  name: string;
  designation: string;
  phoneNumber: string;
  imageUrl: string;
  deskContent?:string;
  deskImageUrl?:string;
}

const DUMMY_MEMBERS: AdminMember[] = [
  {
    name: 'Dr. Gurmeet Singh Dhaliwal',
    designation: 'Chairman',
    phoneNumber: '-',
    imageUrl: 'http://www.bfcet.com/wp-content/uploads/2025/02/Dr.-Gurmeet-Singh-Dhaliwal.png',
    deskImageUrl:'https://www.bfcet.com/wp-content/uploads/2021/01/Dr.-Gurmeet-Singh-Dhaliwal.jpg',
    deskContent:'It has always been my belief that a man is limited only by his thoughts and there are no limits to achieve whatever we desire, as long as this is done within the boundaries of reason, ethics and with positive outlook. This means we have to give way to freedom of thought and generation of new ideas, and to be open to experiment. The possibilities in life are many. \n During my student life, I could see the ambiguity in our education system in which the teachers had only conservative approach towards teaching. It was one way teaching that lacked interaction and involvement by students. There exists a gap between the prevailing education system and the new technologies that has to be understood so that the upcoming technocrats can contribute to work in a good manner. I started with primary education in 1993 and after that I stepped ahead towards professional courses. \n I started with Baba Farid College of Engineering and Technology by using all the experience which I gained moving into varied spheres. Usually the people start with engineering colleges but I started with primary education and then moved ahead towards technical education thus making us distinct from others. I at BFCET believe in creating Engineers who hold a technical expertise and also contribute towards the society in a better way. \n We are committed to bring innovation and excellence in the field of education and our numerous efforts in this direction stand to the fact. \n I extend a cordial invitation to all the visitors of our website and I am sure that this is going to be an exciting journey in itself.'
  },
  {
    name: 'Prof (Dr.) MP Poonia',
    designation: 'Campus Director',
    phoneNumber: '98155-75260',
    imageUrl: 'http://www.bfcet.com/wp-content/uploads/2025/02/puniasir.png',
    deskImageUrl:'https://www.bfcet.com/wp-content/uploads/2025/10/Campus-Director.png',
    deskContent:'At BFGI, we are dedicated to produce future leaders and innovators poised to enact positive transformations on a global scale. Our vibrant campus, esteemed faculty, and cutting-edge facilities converge to foster an environment conducive to academic, professional and personal excellence. Whether students’ aspirations lie in engineering, management, healthcare, or any other field, BFGI offers a diverse array of programs meticulously tailored to align with your passions and ambitions. With a robust emphasis on experiential learning, industry immersion, and holistic enrichment, we ensure that students are well-equipped with the competencies and acumen essential for success in today’s dynamic milieu. In addition to our rigorous academic framework, BFGI presents abundant avenues for extracurricular pursuits, ground breaking research initiatives, immersive internships and global outreach programs, empowering students to delve into their interests and broaden your perspectives significantly. 10 pioneering initiatives have been launched to enhance learning through innovation and engagement. They will not only fulfill students’ aspirations, but also elevate BFGI’s global standards. \n Join a community of self-motivated individuals ardently devoted to learning, innovation and affecting meaningful change. BFGI extends a warm invitation to all aspirants to become integral members of our vibrant learning community. Embark on your journey of exploration, growth and triumph today, as your pathway to a promising future commences right here.'
  },
  {
    name: 'Prof (Dr.) Jayoti Bansal',
    designation: 'Principal, BFCET',
    phoneNumber: '95011-15405',
    imageUrl: 'http://www.bfcet.com/wp-content/uploads/2021/08/Dr-Jyoti-Bansal.jpg',
    deskImageUrl:'https://www.bfcet.com/wp-content/uploads/2021/07/Dr-Jayoti-Bansal.jpg',
    deskContent:'It is my great pleasure to welcome you to Baba Farid College of Engineering & Technology. The Institute is established to create, nurture and shape technical professionals to build an inclusive and sustainable society. BFCET has gained reputation by providing a dynamic base to students for their career advancement. The institution always strives for the overall development of the staff and the students by providing them adequate opportunities for learning. \n Our aim is to impart quality education and practical knowledge to the students for imbibing requisite skills and attitude in them for making them future ready. For fulfilling this aim, we have a team of highly qualified, experienced and dedicated faculty who devote their time not only to teaching but also for the overall development of the students. The advanced infrastructure, laboratories and eco-friendly atmosphere nourish our young minds to aim higher and to improve themselves. The learner-centred approach has been adopted which transforms the student into problem solver and critical thinker. \n We endeavour to offer excellent educational opportunities and requisite skills to our students to serve the society for the betterment of mankind. Students are provided with opportunities for interaction with the experts from the Industry through Workshops, Guest Lectures, Industrial Visits, internships, sponsored projects etc. \n The extracurricular activities like sports, NSS, NCC and cultural activities provide ample opportunities to enhance the ability and overall development of the students. It also instils the values of hard work, discipline, fair play and the spirit of sportsmanship in the students. We encourage our students to participate in these activities and showcase their talent. \n Placement of students is our top priority & for this, we lay special emphasis on the development of students’ personality and their communication skills. All efforts are made to improve the creativity of the students so that they can contribute their best to the society and the country. \n I extend my best wishes to all my students for a successful journey of quality education, training and learning on being a member of this esteemed institution & a bright future thereafter.'
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
  const [selectedMember, setSelectedMember] = useState<AdminMember | null>(null);

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
                onClick={member.deskContent ? () => setSelectedMember(member) : undefined}
                className={`bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 transition-all duration-300 group ${
                  member.deskContent
                    ? 'cursor-pointer hover:shadow-2xl hover:border-[#002b5c]/40 hover:-translate-y-1'
                    : 'hover:shadow-xl hover:border-[#002b5c]/20'
                }`}
              >
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 bg-slate-50 shadow-sm mb-6 group-hover:scale-105 transition-transform duration-500">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    loading="lazy"
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

      {selectedMember && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/60 backdrop-blur-lg transition-opacity" onClick={() => setSelectedMember(null)}>
          <div 
            className="bg-white w-full max-w-5xl max-h-[85vh] flex flex-col relative shadow-2xl rounded-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white rounded text-slate-800 shadow transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
              <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] shrink-0 bg-slate-100">
                <img 
                  src="/bfgi.png" 
                  alt="Background" 
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 w-[160px] sm:w-[200px] md:w-[280px] bg-white p-1 md:p-1.5 shadow-md rounded-xl">
                  <img 
                    src={selectedMember.deskImageUrl || selectedMember.imageUrl} 
                    alt={`${selectedMember.name} Desk`}
                    className="w-full h-auto object-cover border border-slate-100 rounded-lg"
                  />
                </div>
              </div>

              <div className="p-6 sm:p-8 md:p-10 bg-white">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#b91c1c] mb-6 tracking-tight">
                  {selectedMember.designation.includes('Chairman') ? 'Chairman Desk' : `${selectedMember.designation} Desk`}
                </h2>
                
                <div className="space-y-4 text-slate-800 text-[14.5px] sm:text-[15.5px] leading-relaxed text-justify">
                  {selectedMember.deskContent?.split('\n').map((paragraph, idx) => {
                    const trimmed = paragraph.trim();
                    if (!trimmed) return null;
                    return <p key={idx}>{trimmed}</p>;
                  })}
                </div>

                <div className="mt-8 pt-4">
                  <h3 className="text-[14.5px] sm:text-base font-bold text-slate-900">{selectedMember.name}</h3>
                  <p className="text-[14.5px] sm:text-base font-bold text-slate-900">({selectedMember.designation})</p>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

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
