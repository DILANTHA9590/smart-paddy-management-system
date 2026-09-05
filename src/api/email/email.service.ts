import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { AdvisorEmail, EmailStatus } from './entities/advisor-email.entity';
import { SendAdvisorEmailDto } from './dto/send-advisor-email.dto';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(AdvisorEmail)
    private readonly advisorEmailRepo: Repository<AdvisorEmail>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('MAIL_HOST'),
      port: Number(this.configService.getOrThrow<string>('MAIL_PORT')),
      secure: false,
      auth: {
        user: this.configService.getOrThrow<string>('MAIL_USER'),
        pass: this.configService.getOrThrow<string>('MAIL_PASS'),
      },
    });
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.configService.getOrThrow<string>('MAIL_FROM'),
        to: email,
        subject: 'Your OTP Code - PaddyWise',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 500px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">
            <h2 style="color: #15803d; margin-top: 0;">🌾 PaddyWise OTP Verification</h2>
            <p>Hello,</p>
            <p>Your verification code for PaddyWise Smart Agriculture Platform is:</p>
            <div style="background-color: #f0fdf4; border: 1px dashed #22c55e; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
              <h1 style="letter-spacing: 6px; color: #166534; margin: 0; font-size: 32px;">${otp}</h1>
            </div>
            <p style="color: #6b7280; font-size: 14px;">This OTP will expire in 5 minutes. If you did not request this, please ignore this email.</p>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-bottom: 0;">PaddyWise Smart Farming Platform © 2026</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Mail send failed:', error);
      throw new InternalServerErrorException('Failed to send OTP email');
    }
  }

  async sendAdvisorEmail(
    user: any,
    dto: SendAdvisorEmailDto,
  ): Promise<AdvisorEmail> {
    const farmerName = user?.userName || user?.firstName || 'Paddy Farmer';
    const farmerEmail = user?.email || 'farmer@paddywise.lk';

    const newEmail = new AdvisorEmail();
    newEmail.userId = user?.id || '';
    newEmail.farmerName = farmerName;
    newEmail.farmerEmail = farmerEmail;
    newEmail.advisorName = dto.advisorName;
    newEmail.advisorEmail = dto.advisorEmail;
    newEmail.advisorRole = dto.advisorRole || 'Agricultural Advisor';
    newEmail.advisorAvatar = dto.advisorAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150';
    newEmail.subject = dto.subject;
    newEmail.message = dto.message;
    newEmail.attachmentName = dto.attachmentName || '';
    newEmail.status = EmailStatus.PENDING;

    const savedRecord = await this.advisorEmailRepo.save(newEmail);

    try {
      await this.transporter.sendMail({
        from: this.configService.getOrThrow<string>('MAIL_FROM'),
        to: dto.advisorEmail,
        replyTo: farmerEmail,
        subject: `[PaddyWise Advisory Inquiry] ${dto.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #15803d, #166534); padding: 24px; color: white;">
              <h2 style="margin: 0; font-size: 22px;">🌾 New Farmer Consultation Request</h2>
              <p style="margin: 6px 0 0 0; color: #bbf7d0; font-size: 14px;">PaddyWise Agricultural Advisory Network</p>
            </div>
            
            <div style="padding: 24px;">
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                <p style="margin: 0 0 6px 0;"><strong>👨‍🌾 Farmer Name:</strong> ${farmerName}</p>
                <p style="margin: 0 0 6px 0;"><strong>📧 Farmer Email:</strong> ${farmerEmail}</p>
                <p style="margin: 0;"><strong>👨‍💼 Assigned Advisor:</strong> ${dto.advisorName} (${dto.advisorRole || 'Advisor'})</p>
              </div>

              <div style="margin-bottom: 20px;">
                <h3 style="color: #111827; margin-top: 0;">📌 Subject: ${dto.subject}</h3>
                <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; white-space: pre-wrap; color: #374151;">
${dto.message}
                </div>
              </div>

              ${dto.attachmentName ? `
                <p style="font-size: 13px; color: #4b5563;">📎 <strong>Attachment:</strong> ${dto.attachmentName}</p>
              ` : ''}

              <div style="margin-top: 30px; text-align: center;">
                <p style="color: #6b7280; font-size: 13px;">You can reply directly to this email to answer the farmer, or log in to the PaddyWise Advisor Portal.</p>
              </div>
            </div>

            <div style="background-color: #f3f4f6; padding: 16px; text-align: center; font-size: 12px; color: #9ca3af;">
              PaddyWise Smart Farming Platform • Automated Advisory Mailer
            </div>
          </div>
        `,
      });
    } catch (mailError) {
      console.warn('Direct SMTP send failed, but inquiry saved to history:', mailError.message);
    }

    return savedRecord;
  }

  async getFarmerEmailHistory(
    userId: string,
    status?: string,
    search?: string,
  ): Promise<{ data: AdvisorEmail[]; counts: { all: number; replied: number; pending: number; drafts: number } }> {
    const allUserEmails = await this.advisorEmailRepo.find({
      where: userId ? { userId } : {},
      order: { createdAt: 'DESC' },
    });

    const counts = {
      all: allUserEmails.length,
      replied: allUserEmails.filter((e) => e.status === EmailStatus.REPLIED).length,
      pending: allUserEmails.filter((e) => e.status === EmailStatus.PENDING).length,
      drafts: allUserEmails.filter((e) => e.status === EmailStatus.DRAFT).length,
    };

    let filtered = allUserEmails;
    if (status && status !== 'all' && status !== 'All' && status !== 'All Emails') {
      filtered = filtered.filter(
        (e) => e.status.toLowerCase() === status.toLowerCase(),
      );
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.subject.toLowerCase().includes(q) ||
          e.advisorName.toLowerCase().includes(q) ||
          e.message.toLowerCase().includes(q),
      );
    }

    return {
      data: filtered,
      counts,
    };
  }

  async sendReminderEmail(
    recipientEmail: string,
    farmerName: string,
    reminderData: {
      title: string;
      dueDate: string | Date;
      type: string;
      description?: string;
      cultivationName?: string;
    },
  ): Promise<void> {
    try {
      const from = this.configService.get<string>('MAIL_FROM') || 'PaddyWise <noreply@paddywise.lk>';
      const targetDate = new Date(reminderData.dueDate);
      
      const formattedDateEN = targetDate.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueDay = new Date(targetDate);
      dueDay.setHours(0, 0, 0, 0);

      const diffTime = dueDay.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let countdownBadge = '';
      if (diffDays === 0) {
        countdownBadge = '<span style="background-color: #ef4444; color: white; padding: 4px 12px; border-radius: 9999px; font-size: 13px; font-weight: bold;">🔴 අද දිනයේදී සිදුකළ යුතුය (Due Today!)</span>';
      } else if (diffDays === 1) {
        countdownBadge = '<span style="background-color: #f59e0b; color: white; padding: 4px 12px; border-radius: 9999px; font-size: 13px; font-weight: bold;">🟡 හෙට දිනයේදී (Due Tomorrow!)</span>';
      } else if (diffDays > 1) {
        countdownBadge = `<span style="background-color: #10b981; color: white; padding: 4px 12px; border-radius: 9999px; font-size: 13px; font-weight: bold;">🟢 තව දින ${diffDays} කින් (Due in ${diffDays} days)</span>`;
      } else {
        countdownBadge = `<span style="background-color: #6b7280; color: white; padding: 4px 12px; border-radius: 9999px; font-size: 13px; font-weight: bold;">⚪ පසුගිය දිනයක් (Past Due)</span>`;
      }

      await this.transporter.sendMail({
        from,
        to: recipientEmail,
        cc: 'dilanthanayanajith@gmail.com',
        subject: `🌾 [PaddyWise] පොහොර/කාර්යය නියමිත දිනය: ${formattedDateEN} - ${reminderData.title}`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 620px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
            {/* Top Brand Header */}
            <div style="background: linear-gradient(135deg, #15803d, #047857); padding: 28px 24px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">🌾 PaddyWise Smart Agriculture</h1>
              <p style="margin: 6px 0 0 0; opacity: 0.95; font-size: 14px; font-weight: 500;">
                කෘෂිකාර්මික කාර්ය / පොහොර යෙදීමේ මතක්කිරීම (Farming & Fertilizer Reminder)
              </p>
            </div>
            
            <div style="padding: 28px; background-color: #ffffff;">
              <p style="font-size: 15px; margin-top: 0;">ගරු <strong>${farmerName}</strong> මහතාණෙනි/මහත්මියනි,</p>
              <p style="font-size: 14px; color: #4b5563; margin-bottom: 20px;">
                ඔබගේ ගොයම් වගාවේ <strong>පොහොර යෙදීම හෝ අදාළ කෘෂි කාර්යය</strong> නියමිත දිනට සිදුකිරීම සඳහා පහත මතක්කිරීම සටහන් කර ඇත:
              </p>
              
              {/* BIG HIGHLIGHTED DUE DATE CARD */}
              <div style="background: #f0fdf4; border: 2px solid #22c55e; border-radius: 14px; padding: 20px; text-align: center; margin: 20px 0;">
                <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #15803d; text-transform: uppercase; letter-spacing: 0.5px;">
                  📅 පොහොර යෙදිය යුතු / කාර්යය කළ යුතු නියමිත දිනය (Execution Due Date)
                </p>
                <div style="font-size: 24px; font-weight: 800; color: #166534; margin-bottom: 10px;">
                  ${formattedDateEN}
                </div>
                <div>
                  ${countdownBadge}
                </div>
              </div>

              {/* DETAILS TABLE */}
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 22px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #334155;">
                  <tr>
                    <td style="padding: 8px 0; width: 150px; color: #64748b; font-weight: 600;">🔔 කාර්යයේ නම (Title):</td>
                    <td style="padding: 8px 0; font-weight: 700; color: #0f172a; font-size: 15px;">${reminderData.title}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-weight: 600;">🏷️ වර්ගය (Category):</td>
                    <td style="padding: 8px 0;">
                      <span style="background-color: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700;">
                        ${reminderData.type}
                      </span>
                    </td>
                  </tr>
                  ${reminderData.cultivationName ? `
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-weight: 600;">🌱 අදාළ වගාව (Crop / Field):</td>
                    <td style="padding: 8px 0; font-weight: 600; color: #15803d;">${reminderData.cultivationName}</td>
                  </tr>
                  ` : ''}
                </table>

                ${reminderData.description ? `
                <div style="margin-top: 14px; padding-top: 14px; border-top: 1px dashed #cbd5e1; font-size: 13px; color: #1e293b; background-color: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
                  <strong style="color: #15803d; font-size: 13px;">💡 පොහොර මාත්‍රාව සහ උපදෙස් (Dosage & Application Instructions):</strong>
                  <p style="margin: 6px 0 0 0; line-height: 1.6;">${reminderData.description}</p>
                </div>
                ` : ''}
              </div>

              {/* ACTION BUTTON */}
              <div style="text-align: center; margin: 28px 0 12px 0;">
                <a href="http://localhost:5173/calendar" style="background-color: #15803d; color: white; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(21, 128, 61, 0.3);">
                  📅 View in Cultivation Calendar (දින දර්ශනය බලන්න)
                </a>
              </div>
            </div>

            {/* FOOTER */}
            <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px; text-align: center; font-size: 12px; color: #94a3b8;">
              <p style="margin: 0; font-weight: 600; color: #64748b;">PaddyWise Smart Agriculture Platform • Sri Lanka</p>
              <p style="margin: 4px 0 0 0;">Agricultural Advisor Helpline: <strong>+94 81 234 5678</strong> (Mon-Fri 8:30AM - 5:00PM)</p>
            </div>
          </div>
        `,
      });
      console.log(`[EmailService] Enhanced reminder email sent to ${recipientEmail} with prominent date ${formattedDateEN}`);
    } catch (error) {
      console.error('[EmailService] Failed to send reminder email:', error);
    }
  }

  async sendDiseaseAdvisoryEmail(
    recipientEmail: string,
    farmerName: string,
    diagnosisData: {
      diseaseName: string;
      scientificName?: string;
      confidenceScore: number;
      severity: string;
      sinhalaDescription?: string;
      chemicalRemedies?: string;
      organicRemedies?: string;
      treatmentRecommendation: string;
      imageUrl?: string;
      cropVariety?: string;
      fieldName?: string;
    },
  ): Promise<void> {
    try {
      const from = this.configService.get<string>('MAIL_FROM') || 'PaddyWise AI <noreply@paddywise.lk>';
      const isHealthy = diagnosisData.diseaseName.toLowerCase().includes('healthy') || diagnosisData.severity?.toLowerCase() === 'healthy';

      const alertColor = isHealthy ? '#15803d' : diagnosisData.severity === 'High' ? '#dc2626' : '#d97706';
      const alertBg = isHealthy ? '#f0fdf4' : diagnosisData.severity === 'High' ? '#fef2f2' : '#fffbeb';
      const alertBorder = isHealthy ? '#22c55e' : diagnosisData.severity === 'High' ? '#f87171' : '#fcd34d';

      await this.transporter.sendMail({
        from,
        to: recipientEmail,
        cc: 'dilanthanayanajith@gmail.com',
        subject: isHealthy
          ? `🌿 [PaddyWise AI] ගොයම් කොළය නිරෝගීයි: ${diagnosisData.cropVariety || 'වී වගාව'}`
          : `⚠️ [PaddyWise AI රෝග හඳුනාගැනීම] ${diagnosisData.diseaseName} - කඩිනම් ප්‍රතිකාර උපදෙස්`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 640px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
            {/* Header */}
            <div style="background: linear-gradient(135deg, ${alertColor}, #111827); padding: 28px 24px; text-align: center; color: white;">
              <span style="background-color: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                🤖 Gemini AI Vision Diagnosis Report
              </span>
              <h1 style="margin: 12px 0 4px 0; font-size: 24px; font-weight: 800;">
                🌾 ගොයම් රෝග නිර්ණය & ප්‍රතිකාර වාර්තාව
              </h1>
              <p style="margin: 0; opacity: 0.9; font-size: 14px;">
                Department of Agriculture Verified Advisory • Sri Lanka
              </p>
            </div>
            
            <div style="padding: 28px; background-color: #ffffff;">
              <p style="font-size: 15px; margin-top: 0;">ගරු <strong>${farmerName}</strong> මහතාණෙනි/මහත්මියනි,</p>
              <p style="font-size: 14px; color: #4b5563;">
                ඔබ විසින් පද්ධතියට Upload කරන ලද ගොයම් පත්‍රයේ ඡායාරූපය <strong>Google Gemini AI Vision</strong> තාක්ෂණය ඔස්සේ පරීක්ෂා කිරීමෙන් පසු පහත නිගමනයට එළඹ ඇත:
              </p>

              {/* DISEASE HIGHLIGHT CARD */}
              <div style="background: ${alertBg}; border: 2px solid ${alertBorder}; border-radius: 14px; padding: 20px; margin: 20px 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span style="font-size: 12px; font-weight: 700; color: ${alertColor}; text-transform: uppercase;">
                    ${isHealthy ? '✅ ශාක තත්ත්වය: නිරෝගීයි' : '⚠️ හඳුනාගත් රෝගය (Detected Disease)'}
                  </span>
                  <span style="background-color: ${alertColor}; color: white; padding: 3px 10px; border-radius: 9999px; font-size: 12px; font-weight: 700;">
                    ${diagnosisData.confidenceScore}% තහවුරුයි
                  </span>
                </div>
                <div style="font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">
                  ${diagnosisData.diseaseName}
                </div>
                ${diagnosisData.scientificName ? `
                  <div style="font-size: 13px; font-style: italic; color: #64748b; margin-bottom: 8px;">
                    විද්‍යාත්මක නාමය: ${diagnosisData.scientificName}
                  </div>
                ` : ''}
                ${diagnosisData.sinhalaDescription ? `
                  <p style="font-size: 13px; color: #334155; margin: 8px 0 0 0; line-height: 1.5;">
                    ${diagnosisData.sinhalaDescription}
                  </p>
                ` : ''}
              </div>

              {/* CULTIVATION DETAILS */}
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 18px; margin-bottom: 20px; font-size: 13px;">
                <table style="width: 100%;">
                  <tr>
                    <td style="color: #64748b; font-weight: 600; width: 140px;">🌱 වී ප්‍රභේදය (Variety):</td>
                    <td style="color: #0f172a; font-weight: 700;">${diagnosisData.cropVariety || 'වී වගාව'}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; font-weight: 600;">🌾 කුඹුරු ඉඩම (Field):</td>
                    <td style="color: #0f172a; font-weight: 700;">${diagnosisData.fieldName || 'ප්‍රධාන කුඹුර'}</td>
                  </tr>
                </table>
              </div>

              {/* CHEMICAL TREATMENTS */}
              ${diagnosisData.chemicalRemedies ? `
              <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px; margin-bottom: 18px;">
                <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 700; color: #1e40af;">
                  🧪 කෘෂිකර්ම දෙපාර්තමේන්තුවේ නිර්දේශිත රසායනික ප්‍රතිකාර (DOA Chemical Dosages):
                </h3>
                <div style="font-size: 13px; color: #1e3a8a; line-height: 1.6;">
                  ${diagnosisData.chemicalRemedies}
                </div>
              </div>
              ` : ''}

              {/* ORGANIC & CULTURAL REMEDIES */}
              ${diagnosisData.organicRemedies ? `
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 700; color: #166534;">
                  🍃 කාබනික & ගොවිතැන් කළමනාකරණ පිළියම් (Organic / Cultural Practices):
                </h3>
                <div style="font-size: 13px; color: #14532d; line-height: 1.6;">
                  ${diagnosisData.organicRemedies}
                </div>
              </div>
              ` : ''}

              {/* ADVISORY NOTE */}
              <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 10px; padding: 12px; font-size: 12px; color: #92400e; margin-bottom: 24px;">
                💡 <strong>කෘෂි උපදෙස:</strong> බෙහෙත් ඉසීමට පෙර කුඹුරේ ජලය අඟල් 1-2 දක්වා අඩු කරන්න. සුළං රහිත උදෑසන හෝ සවස් කාලයේ ඉසින්න. වැඩිදුර විස්තර සඳහා ඔබේ කෘෂිකර්ම පර්යේෂණ නිෂ්පාදන සහකාර (ARPA) මහතා හමුවන්න.
              </div>

              {/* BUTTON */}
              <div style="text-align: center; margin: 24px 0 8px 0;">
                <a href="http://localhost:5173/disease" style="background-color: #15803d; color: white; padding: 13px 28px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(21, 128, 61, 0.3);">
                  🔍 View Full AI Diagnosis in PaddyWise Portal
                </a>
              </div>
            </div>

            {/* Footer */}
            <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8;">
              <p style="margin: 0; font-weight: 600; color: #64748b;">PaddyWise Smart Agriculture Platform • AI Pathology Engine</p>
              <p style="margin: 4px 0 0 0;">Helpline: <strong>+94 81 234 5678</strong> | Department of Agriculture Sri Lanka</p>
            </div>
          </div>
        `,
      });
      console.log(`[EmailService] Disease advisory email dispatched to ${recipientEmail}`);
    } catch (error) {
      console.error('[EmailService] Failed to send disease advisory email:', error);
    }
  }

  async getAdvisorsList() {
    return [
      {
        id: 'adv-0',
        name: 'Mr. Dilantha Nayanajith',
        role: 'Senior Agricultural Advisor',
        email: 'dilanthanayanajith@gmail.com',
        phone: '077 959 0123',
        whatsapp: '+94779590123',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        status: 'Online',
        specializations: ['Smart Farming', 'Paddy Cultivation', 'Crop Protection'],
        bio: 'Senior Agri-Tech Specialist and Cultivation Advisor helping farmers with precision agriculture and high-yield methods.',
      },
      {
        id: 'adv-1',
        name: 'Dr. Nadee Perera',
        role: 'Agricultural Advisor',
        email: 'nadee.perera@paddywise.lk',
        phone: '077 458 9123',
        whatsapp: '+94774589123',
        avatar: '/advisors/nadee_perera.png',
        status: 'Online',
        specializations: ['Paddy Cultivation', 'Disease Management', 'Soil Health'],
        bio: 'Senior Agricultural Scientist with over 12 years of experience in rice crop protection and sustainable paddy management.',
      },
      {
        id: 'adv-2',
        name: 'Mr. Chaminda Silva',
        role: 'Irrigation Officer',
        email: 'chaminda.silva@paddywise.lk',
        phone: '071 892 3456',
        whatsapp: '+94718923456',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
        status: 'Online',
        specializations: ['Irrigation', 'Fertilizer Management', 'Crop Planning'],
        bio: 'Irrigation and water management specialist focusing on optimal water allocation and high-yield paddy cycles.',
      },
      {
        id: 'adv-3',
        name: 'Ms. Harshini Fernando',
        role: 'Extension Officer',
        email: 'harshini.fernando@paddywise.lk',
        phone: '076 345 6789',
        whatsapp: '+94763456789',
        avatar: '/advisors/harshini_fernando.png',
        status: 'Offline',
        specializations: ['Government Schemes', 'Farmer Support', 'Field Visits'],
        bio: 'Agricultural extension officer supporting rural farmers with government subsidy programs, seeds, and fertilizer quotas.',
      },
    ];
  }
}
